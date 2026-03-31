import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["POSTGRESS_CONNECTION"] || "postgresql://postgres:postgres@localhost:5432/expense_manager?schema=public",
  },
});
