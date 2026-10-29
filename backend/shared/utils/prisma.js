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
    });
  }
}

neonConfig.webSocketConstructor = SafeWebSocket;

const globalForPrisma = globalThis;

const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;

function isConnectionError(error) {
  const msg = error?.message?.toLowerCase() || "";
  return (
    msg.includes("database has been paused") ||
    msg.includes("connection terminated") ||
    msg.includes("timeout") ||
    msg.includes("ecancelled") ||
    msg.includes("etimedout") ||
    msg.includes("could not connect") ||
    msg.includes("database is starting") ||
    msg.includes("p1001")
  );
}

function wrapWithRetry(model) {
  const methods = {};
  for (const method of ["findUnique", "findFirst", "findMany", "create", "update", "updateMany", "upsert", "delete", "deleteMany", "count", "aggregate", "groupBy"]) {
    if (typeof model[method] === "function") {
      methods[method] = (...args) => {
        const call = () => model[method](...args);
        return callWithRetry(call, 1);
      };
    }
  }
  return new Proxy(model, {
    get(target, prop) {
      if (prop in methods) return methods[prop];
      return target[prop];
    },
  });
}

function callWithRetry(call, attempt) {
  return call().catch((error) => {
    if (attempt < MAX_RETRIES && isConnectionError(error)) {
      console.warn(`[PRISMA] Query failed (attempt ${attempt}/${MAX_RETRIES}), retrying...`);
      return new Promise((r) => setTimeout(r, RETRY_DELAY)).then(() => callWithRetry(call, attempt + 1));
    }
    throw error;
  });
}

const MODEL_NAMES = [
  "user", "hero", "about", "skill", "service", "experience", "education",
  "project", "testimonial", "contactMessage", "setting", "mediaAsset",
  "activity", "statistic", "avatar3D", "visitor", "visit",
];

let _prisma = null;

function createPrismaClient() {
  if (_prisma) return _prisma;

  const url = process.env.DATABASE_URL || "";
  const isNeon = url.includes("neon.tech");
  const logConfig = process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  if (globalForPrisma.prisma) {
    _prisma = globalForPrisma.prisma;
  } else if (isNeon) {
    const wsUrl = url.replace("-pooler", "");
    const pool = new Pool({ connectionString: wsUrl });
    const adapter = new PrismaNeon(pool);
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

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;

  for (const name of MODEL_NAMES) {
    const original = _prisma[name];
    if (original && typeof original === "object" && typeof original.findMany === "function") {
      _prisma[name] = wrapWithRetry(original);
    }
  }

  return _prisma;
}

const prisma = new Proxy({}, {
  get(_, prop) {
    return createPrismaClient()[prop];
  },
});

export { prisma };
