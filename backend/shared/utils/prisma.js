import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const rawPrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = rawPrisma;

const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;
const wrappedModels = new Map();

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
  for (const method of ["findUnique", "findFirst", "findMany", "create", "update", "upsert", "delete", "count", "aggregate", "groupBy"]) {
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

for (const name of MODEL_NAMES) {
  const original = rawPrisma[name];
  if (original && typeof original === "object" && typeof original.findMany === "function") {
    rawPrisma[name] = wrapWithRetry(original);
  }
}

export { rawPrisma as prisma };
