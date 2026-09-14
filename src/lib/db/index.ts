import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

// A module-level singleton so dev-mode hot reload doesn't reopen the file
// on every edit.
const globalForDb = globalThis as unknown as { sqlite?: Database.Database; drizzleDb?: Db };

function getDb(): Db {
  if (!globalForDb.drizzleDb) {
    const file = process.env.DATABASE_URL;
    if (!file) {
      throw new Error("DATABASE_URL is not set — copy .env.example to .env.local and fill it in.");
    }
    mkdirSync(path.dirname(path.resolve(file)), { recursive: true });

    const sqlite = globalForDb.sqlite ?? new Database(file);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    if (process.env.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

    globalForDb.drizzleDb = drizzle(sqlite, { schema });
  }
  return globalForDb.drizzleDb;
}

// Lazy — opening the file only on first real query, not at import time, so
// `next build` (which loads every route module to read its config, without
// invoking it) doesn't require DATABASE_URL to succeed.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});
