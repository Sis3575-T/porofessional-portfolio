import { execSync } from "child_process";

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("\n--- Step 1: Generate Prisma Client ---\n");
  try {
    run("npx prisma generate --schema=backend/prisma/schema.prisma");
  } catch (e) {
    console.log("Prisma generate failed, but continuing...\n");
  }

  console.log("\n--- Step 2: Push schema to database ---\n");
  let pushOk = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      run("npx prisma db push --schema=backend/prisma/schema.prisma");
      pushOk = true;
      break;
    } catch (e) {
      console.log(`\nPush failed (attempt ${attempt}/5). Retrying in 5s...`);
      await sleep(5000);
    }
  }

  if (!pushOk) {
    console.error("\nDatabase push failed after 5 attempts.");
    console.error("Your Neon database may be suspended.");
    console.error("1. Go to https://console.neon.tech");
    console.error("2. Open your project → it will auto-resume");
    console.error("3. Then run: node setup-db.js");
    process.exit(1);
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`\n--- Step 3: Seed database (attempt ${attempt}/5) ---\n`);
      run("node backend/prisma/seed.js");
      console.log("\nSetup complete!");
      return;
    } catch (e) {
      console.log(`\nSeed failed (attempt ${attempt}/5). Retrying in 3s...`);
      await sleep(3000);
    }
  }

  console.error("\nSeed failed after 5 attempts.");
  console.error("Make sure your Neon database is active, then run: node setup-db.js");
  process.exit(1);
}

main();
