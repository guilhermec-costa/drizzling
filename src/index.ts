import {config} from "dotenv";
config();

import { Hono } from 'hono'
import bookRouter from './routes/ books.js';
import {serve} from "@hono/node-server"
import { getPgClient } from "./scripts/migrate.js";
import {drizzle} from "drizzle-orm/postgres-js"
import { globalSchema } from "./db/index-schema.js";

const pgClient = getPgClient();
const db = drizzle(pgClient, {
  logger: false,
  schema: globalSchema,
});

const app = new Hono();
app.route("/books", bookRouter);

serve({
  fetch: app.fetch,
  port: 3000 
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
