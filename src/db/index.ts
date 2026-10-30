import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const parsedDatabaseUrl = new URL(databaseUrl);
// Vercel instances must share connections through Supavisor transaction mode.
// Session mode reserves a backend for every idle client and exhausts small pools.
if (parsedDatabaseUrl.hostname.endsWith(".pooler.supabase.com") && (!parsedDatabaseUrl.port || parsedDatabaseUrl.port === "5432")) {
  parsedDatabaseUrl.port = "6543";
}

parsedDatabaseUrl.searchParams.delete("sslmode");
parsedDatabaseUrl.searchParams.delete("uselibpqcompat");

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: parsedDatabaseUrl.toString(),
    ssl: { rejectUnauthorized: true },
    max: 2,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 10000,
  });

globalForDb.__arenaNextJsPostgresqlPool = pool;

export const db = drizzle(pool, { schema });
