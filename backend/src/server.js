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

async function runWithRetry(cmd, label, attempts = 2) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (runCommand(cmd)) {
      console.log(`[DB] ${label} complete`);
      return true;
    }
    if (attempt < attempts) {
      console.warn(`[DB] ${label} failed (attempt ${attempt}/${attempts}), retrying in 3s...`);
      await sleep(3000);
    }
  }
  console.error(`[DB] ${label} failed after ${attempts} attempts`);
  return false;
}

function ensureConnectTimeout(url) {
  if (!url || url.includes("connect_timeout=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connect_timeout=60`;
}

async function syncDatabase() {
  if (process.env.AUTO_DB_PUSH !== "true") {
    console.log("[DB] Schema push skipped (AUTO_DB_PUSH is not 'true').");
    return;
  }
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  const prismaBin = findPrismaBin();
  console.log("[DB] Syncing database schema from:", schemaPath);

  process.env.DATABASE_URL = ensureConnectTimeout(process.env.DATABASE_URL);

  await runWithRetry(
    `${prismaBin} db push --schema="${schemaPath}" --accept-data-loss`,
    "Schema push"
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

async function ensureAdminUser() {
  const { prisma } = await import("shared");
  const bcrypt = (await import("bcryptjs")).default;
  const adminEmail = (process.env.ADMIN_EMAIL || "sisay3575@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Sis3575@";
  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const emailsToEnsure = Array.from(new Set([adminEmail, "sisay3575@gmail.com"]));
    for (const email of emailsToEnsure) {
      await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword, role: "ADMIN", isActive: true },
        create: { email, password: hashedPassword, role: "ADMIN", isActive: true },
      });
      console.log(`[AUTH] Admin user verified/updated: ${email}`);
    }
    const setting = await prisma.setting.findFirst();
    if (setting) {
      let social = {};
      try { social = JSON.parse(setting.socialLinks || "{}"); } catch {}
      if (!social.github || social.github.includes("/user/") || social.github.includes("/sisay")) {
        social.github = "https://github.com/Sis3575-T";
        social.linkedin = "https://www.linkedin.com/in/sisay-temesgen-412290447/";
        social.telegram = "https://t.me/sisaytem";
        await prisma.setting.update({
          where: { id: setting.id },
          data: { socialLinks: JSON.stringify(social) },
        });
        console.log(`[SETTINGS] Verified socialLinks with https://github.com/Sis3575-T`);
      }
    }
  } catch (err) {
    console.warn(`[AUTH] Could not auto-ensure admin user at startup:`, err.message);
  }
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await syncDatabase();
  await testDbConnection();
  await ensureAdminUser();
});
