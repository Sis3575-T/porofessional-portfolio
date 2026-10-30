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

async function autoInitDatabase() {
  const { prisma } = await import("shared");
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  const prismaBin = findPrismaBin();

  process.env.DATABASE_URL = ensureConnectTimeout(process.env.DATABASE_URL);

  let tables = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      const rawTables = await prisma.$queryRaw`
        SELECT table_name::text as table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      tables = rawTables.map((t) => t.table_name);
      console.log(`[DB] Database connected. Public tables detected (${tables.length}):`, tables.join(", "));
      break;
    } catch (err) {
      console.warn(`[DB] Connection attempt ${attempt}/3 failed (${err.message}), retrying in 2s...`);
      if (attempt < 3) await sleep(2000);
    }
  }

  // If essential tables are missing or AUTO_DB_PUSH=true, run prisma db push
  const essentialTables = ["users", "projects", "hero", "about", "skills", "settings"];
  const missingTables = essentialTables.filter((t) => !tables.includes(t));

  if (process.env.AUTO_DB_PUSH === "true" || missingTables.length > 0) {
    console.warn(`[DB] Syncing schema (missing tables: [${missingTables.join(", ")}])...`);
    await runWithRetry(
      `${prismaBin} db push --schema="${schemaPath}" --accept-data-loss`,
      "Database schema push"
    );
  }

  // Check if initial portfolio data exists; if empty, run seed.js
  let shouldSeed = false;
  try {
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    console.log(`[DB] Records: users=${userCount}, projects=${projectCount}`);
    if (userCount === 0 || projectCount === 0) {
      shouldSeed = true;
    }
  } catch (err) {
    console.warn("[DB] Could not count records, running seed to ensure integrity:", err.message);
    shouldSeed = true;
  }

  if (shouldSeed) {
    console.log("[DB] Seeding essential database content from seed.js...");
    const seedScript = path.join(__dirname, "../prisma/seed.js");
    await runWithRetry(`node "${seedScript}"`, "Database seeding");
  }

  // Always verify admin credentials and vital settings
  await ensureAdminUser();
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await autoInitDatabase();
});
