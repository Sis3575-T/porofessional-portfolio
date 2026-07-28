import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

const rawPrisma =
  globalForPrisma.prisma ??
  prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = rawPrisma;

const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;
const wrappedModels = new Map();

const MODEL_METHODS = [
  "findUnique", "findFirst", "findMany", "create", "update",
  "upsert", "delete", "count", "aggregate", "groupBy",
];

function isConnectionError(error) {
  const msg = error?.message?.toLowerCase() || "";
  return (
    msg.includes("database has been paused") ||
    msg.includes("connection terminated") ||
    msg.includes("timeout") ||
    msg.includes("ecancelled") ||
    msg.includes("etimedout") ||
    msg.includes("could not connect") ||
    msg.includes("database is starting")
  );
}

function wrapWithRetry(model) {
  const wrapped = {};
  for (const method of MODEL_METHODS) {
    if (typeof model[method] === "function") {
      wrapped[method] = async (...args) => {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            return await model[method](...args);
          } catch (error) {
            if (attempt === MAX_RETRIES || !isConnectionError(error)) {
              throw error;
            }
            console.warn(`[PRISMA] ${method} failed (attempt ${attempt}/${MAX_RETRIES}), retrying...`);
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
          }
        }
      };
    }
  }
  return wrapped;
}

export const prisma = new Proxy(rawPrisma, {
  get(target, prop) {
    if (typeof prop !== "string" || prop.startsWith("$")) {
      return target[prop];
    }
    if (!wrappedModels.has(prop)) {
      const model = target[prop];
      if (model && typeof model === "object") {
        const wrapped = wrapWithRetry(model);
        wrappedModels.set(prop, wrapped);
      }
    }
    return wrappedModels.get(prop) ?? target[prop];
  },
});