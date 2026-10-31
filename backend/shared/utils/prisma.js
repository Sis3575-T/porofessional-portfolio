import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../backend/.env") });
dotenv.config({ path: path.join(__dirname, "../../../.env") });

if (process.env.NODE_ENV !== "production" && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

class SafeWebSocket extends ws {
  constructor(address, protocols, options) {
    let opts = {};
    let protos = protocols;
    if (typeof protocols === "object" && protocols !== null && !Array.isArray(protocols)) {
      opts = protocols;
      protos = undefined;
    } else if (typeof options === "object" && options !== null) {
      opts = options;
    }
    super(address, protos, {
      ...opts,
      rejectUnauthorized: false,
      family: 4,
      handshakeTimeout: 20000,
    });
  }
}

neonConfig.webSocketConstructor = SafeWebSocket;

const globalForPrisma = globalThis;

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 800;

function isConnectionError(error) {
  const msg = (
    error?.message ||
    error?.error?.message ||
    error?.cause?.message ||
    error?.error?.code ||
    error?.code ||
    String(error?.error || error || "")
  ).toLowerCase();
  return (
    msg.includes("database has been paused") ||
    msg.includes("connection terminated") ||
    msg.includes("connection closed") ||
    msg.includes("timeout") ||
    msg.includes("ecancelled") ||
    msg.includes("etimedout") ||
    msg.includes("econnrefused") ||
    msg.includes("econnreset") ||
    msg.includes("socket hang up") ||
    msg.includes("websocket is not open") ||
    msg.includes("could not connect") ||
    msg.includes("database is starting") ||
    msg.includes("p1001") ||
    msg.includes("p1002") ||
    msg.includes("p1017") ||
    msg.includes("aggregateerror") ||
    error?.name === "ErrorEvent" ||
    error?.constructor?.name === "ErrorEvent" ||
    Boolean(error?.error)
  );
}

let _prisma = null;
let _pool = null;
let _resetPromise = null;

async function debounceReset() {
  if (_resetPromise) return _resetPromise;
  _resetPromise = (async () => {
    try {
      console.warn("[PRISMA] Recycling database connection pool after persistent connection errors...");
      if (_pool) {
        try { await _pool.end(); } catch {}
        _pool = null;
      }
      if (_prisma) {
        try { await _prisma.$disconnect(); } catch {}
        _prisma = null;
      }
      globalForPrisma.prisma = null;
    } finally {
      await new Promise((r) => setTimeout(r, 400));
      _resetPromise = null;
    }
  })();
  return _resetPromise;
}

function callWithRetry(operation, attempt = 1) {
  return operation().catch(async (error) => {
    if (attempt < MAX_RETRIES && isConnectionError(error)) {
      const jitter = Math.floor(Math.random() * 300);
      const delay = BASE_RETRY_DELAY * attempt + jitter;
      console.warn(
        `[PRISMA] Connection attempt ${attempt}/${MAX_RETRIES} transient issue (${error?.message || error}). Retrying in ${delay}ms...`
      );

      // Only perform a debounced reset if multiple retries have failed
      if (attempt === 3) {
        await debounceReset();
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      return callWithRetry(operation, attempt + 1);
    }
    throw error;
  });
}

function createPrismaClient() {
  if (_prisma) return _prisma;

  const url = process.env.DATABASE_URL || "";
  const isNeon = url.includes("neon.tech") && process.env.PRISMA_FORCE_NATIVE !== "true";
  const logConfig = process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (isNeon) {
    if (!_pool) {
      _pool = new Pool({
        connectionString: url,
        max: 8,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
      });
      _pool.on("error", (err) => {
        console.warn("[PRISMA/POOL] Idle client notice (safely discarded):", err?.message || err);
      });
    }
    const adapter = new PrismaNeon(_pool);
    _prisma = new PrismaClient({ adapter, log: logConfig });
  } else {
    _prisma = new PrismaClient({
      log: logConfig,
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  return _prisma;
}

const RETRYABLE_METHODS = new Set([
  "findUnique", "findFirst", "findMany", "create", "update", "updateMany",
  "upsert", "delete", "deleteMany", "count", "aggregate", "groupBy",
]);

const prisma = new Proxy({}, {
  get(_, prop) {
    if (prop === "$connect") {
      return (...args) => callWithRetry(() => createPrismaClient().$connect(...args), 1);
    }
    if (prop === "$disconnect") {
      return () => {
        if (_prisma) {
          const p = _prisma.$disconnect();
          _prisma = null;
          return p;
        }
        return Promise.resolve();
      };
    }
    if (prop === "$queryRaw" || prop === "$queryRawUnsafe") {
      return (...args) => callWithRetry(() => createPrismaClient()[prop](...args), 1);
    }
    if (prop === "$executeRaw" || prop === "$executeRawUnsafe") {
      return (...args) => callWithRetry(() => createPrismaClient()[prop](...args), 1);
    }
    if (prop === "$transaction") {
      return (...args) => createPrismaClient().$transaction(...args);
    }

    return new Proxy({}, {
      get(__, method) {
        if (RETRYABLE_METHODS.has(method)) {
          return (...args) =>
            callWithRetry(() => {
              const client = createPrismaClient();
              const model = client[prop];
              if (!model || typeof model[method] !== "function") {
                throw new Error(`Prisma model '${String(prop)}' does not have method '${String(method)}'`);
              }
              return model[method](...args);
            }, 1);
        }
        const client = createPrismaClient();
        const model = client[prop];
        return model ? model[method] : undefined;
      },
    });
  },
});

export { prisma };
