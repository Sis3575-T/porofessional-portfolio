import { execSync } from "child_process";

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("\n--- Step 1: Push schema to database ---\n");
  run("npx prisma db push");

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`\n--- Step 2: Seed database (attempt ${attempt}/5) ---\n`);
      run("node prisma/seed.js");
      console.log("\nSetup complete!");
      return;
    } catch (e) {
      console.log(`Seed failed (attempt ${attempt}/5). Retrying in 3s...`);
      await sleep(3000);
    }
  }

  console.error("\nSeed failed after 5 attempts. Your Neon database may be suspended.");
  console.error("Go to https://console.neon.tech → wake up your database → run: node prisma/seed.js");
  process.exit(1);
}

main();
