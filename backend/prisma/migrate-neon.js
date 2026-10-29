import { execSync } from "child_process";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function migrate() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined in environment");
  }

  console.log("Generating schema migration SQL from schema.prisma...");
  const rawSql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel backend/prisma/schema.prisma --script",
    { encoding: "utf8" }
  );

  // Strip npm notices and SQL line comments
  const withoutNotices = rawSql
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("npm notice"))
    .join("\n");

  const withoutComments = withoutNotices.replace(/--.*$/gm, "");

  const statements = withoutComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} DDL statements to execute.`);
  const sql = neon(url);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await sql(stmt);
      console.log(`[${i + 1}/${statements.length}] Success: ${stmt.slice(0, 40).replace(/\s+/g, ' ')}...`);
    } catch (err) {
      if (err.message && (err.message.includes("already exists") || err.message.includes("duplicate key"))) {
        console.log(`[${i + 1}/${statements.length}] Notice: Already exists.`);
      } else {
        console.error(`[${i + 1}/${statements.length}] Failed on: ${stmt.substring(0, 80)}...`);
        throw err;
      }
    }
  }

  console.log("Schema migration completed successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
