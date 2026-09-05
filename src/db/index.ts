// Database connection via Neon serverless driver + Drizzle ORM
// Menggunakan @neondatabase/serverless agar kompatibel dengan Vercel Functions/Edge
// tanpa exhaust connection pool

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
    "Copy .env.example ke .env.local dan isi dengan connection string Neon."
  );
}

// Neon HTTP driver — cocok untuk serverless/edge (tidak persistent connection)
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema, logger: process.env.NODE_ENV === "development" });

// Re-export semua schema types untuk kemudahan import
export * from "./schema";
export type { InferSelectModel, InferInsertModel } from "drizzle-orm";
