import {defineConfig} from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "src/application/**/schemas/*.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_USER,
    host: process.env.DB_HOST,
  }
}) 