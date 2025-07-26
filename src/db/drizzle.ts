import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema"; // 👈 Import your schema (users, subscriptions)

const sql = neon(process.env.DATABASE_URL!); // 👈 creates SQL client from Neon connection string

const db = drizzle(sql, { schema }); // 👈 attach schema here for type-safe queries

export default db;