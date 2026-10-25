import "server-only";
import postgres from "postgres";

const globalForSql = globalThis as unknown as { sql?: postgres.Sql };

export function db(): postgres.Sql {
  if (!globalForSql.sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set.");
    // prepare: false keeps it compatible with transaction-mode poolers (Neon pooled URL).
    globalForSql.sql = postgres(url, { max: 5, prepare: false, idle_timeout: 20 });
  }
  return globalForSql.sql;
}
