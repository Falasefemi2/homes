/** @format */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema"; // Adjust this import path as needed

const sql = neon(process.env.DATABASE_URL!);

// const db = drizzle(sql);

// export default db;

export const db = drizzle(sql, { schema });
