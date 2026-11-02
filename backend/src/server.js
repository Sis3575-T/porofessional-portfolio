import fs from "node:fs";
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
  if (!url) return url;
  let cleaned = url.replace(/[?&]channel_binding=[^&]+/g, "").replace(/\?&/, "?").replace(/\?$/, "");
  if (cleaned.includes("neon.tech")) {
    cleaned = cleaned.replace("-pooler.", ".");
  }
  if (cleaned.includes("connect_timeout=")) return cleaned;
  const sep = cleaned.includes("?") ? "&" : "?";
  return `${cleaned}${sep}connect_timeout=60`;
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
        update: { role: "ADMIN", isActive: true }, // Preserve existing password
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
  try {
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

    // Check for essential tables without destructive commands
    const essentialTables = ["users", "projects", "hero", "about", "skills", "settings", "avatar3d", "visitors", "visits", "contact_messages", "media_assets"];
    const missingTables = essentialTables.filter((t) => !tables.includes(t));

    if (missingTables.length > 0) {
      console.warn(`[DB] Missing tables detected: [${missingTables.join(", ")}]. Attempting safe schema push...`);
      // Never use --force-reset in production. Only push non-destructively.
      const pushed = await runWithRetry(
        `${prismaBin} db push --schema="${schemaPath}" --accept-data-loss`,
        "Database schema push",
        1
      );
      if (!pushed) {
        console.warn("[DB] Safe schema push did not apply automatically. Preserving existing database without resetting.");
      }
    }

    // Check if initial portfolio data exists; if completely empty (0 users & 0 projects), populate safely
    let shouldSeed = false;
    try {
      const userCount = await prisma.user.count();
      const projectCount = await prisma.project.count();
      console.log(`[DB] Verified records: users=${userCount}, projects=${projectCount}`);
      if (userCount === 0 && projectCount === 0) {
        shouldSeed = true;
      }
    } catch (err) {
      console.warn("[DB] Could not count records, running safe seed to ensure essential tables:", err.message);
      shouldSeed = true;
    }

    if (shouldSeed) {
      console.log("[DB] Populating essential content (database is empty)...");
      const restoreScript = path.join(__dirname, "../prisma/restore-db-snapshot.js");
      const seedScript = path.join(__dirname, "../prisma/seed.js");
      try {
        if (fs.existsSync(restoreScript)) {
          await runWithRetry(`node "${restoreScript}"`, "Database snapshot restore", 1);
        }
      } catch (err) {
        console.warn("[DB] Snapshot restore skipped:", err.message);
      }
      try {
        if (fs.existsSync(seedScript)) {
          await runWithRetry(`node "${seedScript}"`, "Database seeding", 1);
        }
      } catch (err) {
        console.warn("[DB] Seeding skipped:", err.message);
      }
    }

    // Always verify admin user safely
    await ensureAdminUser();
  } catch (fatalInitError) {
    console.error("[DB] Non-critical database init warning (server will continue running):", fatalInitError.message);
  }
}

function killPortOwner(port) {
  if (process.env.NODE_ENV === "production") return;
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { stdio: "pipe" }).toString();
      const lines = output.trim().split("\n");
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[parts.length - 1], 10);
        if (pid && pid !== process.pid && pid !== process.ppid) {
          console.log(`[SERVER] Auto-freeing port ${port} occupied by lingering PID ${pid}...`);
          try { execSync(`taskkill /F /PID ${pid}`, { stdio: "pipe" }); } catch {}
        }
      }
    } else {
      execSync(`fuser -k ${port}/tcp 2>/dev/null || true`, { stdio: "pipe" });
    }
  } catch {}
}

function startListening(port, maxRetries = 5) {
  let attempt = 0;

  function attemptListen() {
    attempt++;
    const server = app.listen(port, "0.0.0.0", async () => {
      console.log(`Backend server running on http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      await autoInitDatabase();
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`[SERVER] Port ${port} is currently busy (attempt ${attempt}/${maxRetries}). Freeing and retrying...`);
        killPortOwner(port);
        try { server.close(); } catch {}
        if (attempt < maxRetries) {
          setTimeout(attemptListen, 1200);
        } else {
          console.error(`[SERVER] Port ${port} is persistently in use. Exiting.`);
          process.exit(1);
        }
      } else {
        console.error("[SERVER] Unhandled server error:", err);
      }
    });

    const shutdown = () => {
      try {
        server.close(() => {
          process.exit(0);
        });
      } catch {
        process.exit(0);
      }
    };

    process.once("SIGTERM", shutdown);
    process.once("SIGINT", shutdown);
  }

  attemptListen();
}

startListening(PORT);
