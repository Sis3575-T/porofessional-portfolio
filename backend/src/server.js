import app from "./app.js";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

function findPrismaBin() {
  const candidates = [
    path.join(__dirname, "../../node_modules/.bin/prisma"),
    path.join(__dirname, "../../node_modules/prisma/build/index.js"),
    path.join(__dirname, "../node_modules/.bin/prisma"),
  ];
  for (const c of candidates) {
    try { execSync(`"${c}" --version`, { stdio: "pipe" }); return `"${c}"`; } catch {}
  }
  return "npx prisma";
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "pipe", timeout: 120000, shell: true });
    return true;
  } catch (error) {
    console.error(`[DB] Command failed: ${cmd}`, error.stderr?.toString() || error.message);
    return false;
  }
}

async function runWithRetry(cmd, label, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (runCommand(cmd)) {
      console.log(`[DB] ${label} complete`);
      return true;
    }
    if (attempt < attempts) {
      console.warn(`[DB] ${label} failed (attempt ${attempt}/${attempts}), retrying in 5s...`);
      await sleep(5000);
    }
  }
  console.error(`[DB] ${label} failed after ${attempts} attempts`);
  return false;
}

// Neon pauses idle free-tier databases; a cold start can exceed Prisma's default
// ~5s connect timeout. Give the CLI commands and the client longer to connect.
function ensureConnectTimeout(url) {
  if (!url || url.includes("connect_timeout=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connect_timeout=60`;
}

async function syncDatabase() {
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  const prismaBin = findPrismaBin();
  console.log("[DB] Syncing database schema from:", schemaPath);

  process.env.DATABASE_URL = ensureConnectTimeout(process.env.DATABASE_URL);

  await runWithRetry(
    `${prismaBin} db push --schema="${schemaPath}" --accept-data-loss`,
    "Schema push"
  );

  await runWithRetry(
    `${prismaBin} generate --schema="${schemaPath}"`,
    "Prisma client generated",
    2
  );
}

async function testDbConnection() {
  const { prisma } = await import("shared");
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[DB] Database connection successful`);
  } catch (error) {
    console.error(`[DB] Database connection FAILED:`, error.message);
  }
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await syncDatabase();
  await testDbConnection();
});
