/** @format */

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // dbCredentials: {
  //   url: process.env.NEON_DATABASE_URL!,
  // },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
