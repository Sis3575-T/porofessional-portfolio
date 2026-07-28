import app from "./app.js";
import { prisma } from "shared";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

async function syncDatabase() {
  try {
    const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
    console.log("[DB] Syncing database schema from:", schemaPath);
    execSync(`npx prisma db push --schema=${schemaPath} --accept-data-loss`, {
      stdio: "pipe",
      timeout: 60000,
    });
    console.log("[DB] Schema sync complete");
  } catch (error) {
    console.error("[DB] Schema sync failed:", error.stderr?.toString() || error.message);
  }
}

async function testDbConnection() {
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
