import app from "./app.js";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "pipe", timeout: 60000 });
    return true;
  } catch (error) {
    console.error(`[DB] Command failed: ${cmd}`, error.stderr?.toString() || error.message);
    return false;
  }
}

async function syncDatabase() {
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  console.log("[DB] Syncing database schema from:", schemaPath);

  const pushed = runCommand(`npx prisma db push --schema=${schemaPath} --accept-data-loss`);
  if (pushed) console.log("[DB] Schema push complete");

  const generated = runCommand(`npx prisma generate --schema=${schemaPath}`);
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
