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

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "pipe", timeout: 60000, shell: true });
    return true;
  } catch (error) {
    console.error(`[DB] Command failed: ${cmd}`, error.stderr?.toString() || error.message);
    return false;
  }
}

async function syncDatabase() {
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  const prismaBin = findPrismaBin();
  console.log("[DB] Syncing database schema from:", schemaPath);

  const pushed = runCommand(`${prismaBin} db push --schema="${schemaPath}" --accept-data-loss`);
  if (pushed) console.log("[DB] Schema push complete");

  const generated = runCommand(`${prismaBin} generate --schema="${schemaPath}"`);
  if (generated) console.log("[DB] Prisma client generated");
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
