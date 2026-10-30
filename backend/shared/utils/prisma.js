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
    super(address, protocols, {
      ...options,
      rejectUnauthorized: false,
      family: 4,
    });
  }
}

neonConfig.webSocketConstructor = SafeWebSocket;

const globalForPrisma = globalThis;

const MAX_RETRIES = 5;
const RETRY_DELAY = 1500;

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
    msg.includes("aggregateerror") ||
    error?.name === "ErrorEvent" ||
    error?.constructor?.name === "ErrorEvent" ||
    Boolean(error?.error)
  );
}

let _prisma = null;
let _pool = null;

function callWithRetry(operation, attempt = 1) {
  return operation().catch((error) => {
    if (attempt < MAX_RETRIES && isConnectionError(error)) {
      console.warn(
        `[PRISMA] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${error?.message || error}. Resetting connection and retrying in ${RETRY_DELAY * attempt}ms...`
      );
      if (_pool) {
        try { _pool.end().catch(() => {}); } catch {}
        _pool = null;
      }
      if (_prisma) {
        try { _prisma.$disconnect().catch(() => {}); } catch {}
        _prisma = null;
      }
      if (globalForPrisma.prisma) globalForPrisma.prisma = null;

      return new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt)).then(() =>
        callWithRetry(operation, attempt + 1)
      );
    }
    throw error;
  });
}

function createPrismaClient() {
  if (_prisma) return _prisma;

  const url = process.env.DATABASE_URL || "";
  const isNeon = url.includes("neon.tech");
  const logConfig = process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (isNeon) {
    _pool = new Pool({ connectionString: url });
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
    if (prop === "$queryRaw") {
      return (...args) => callWithRetry(() => createPrismaClient().$queryRaw(...args), 1);
    }
    if (prop === "$executeRaw") {
      return (...args) => callWithRetry(() => createPrismaClient().$executeRaw(...args), 1);
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
