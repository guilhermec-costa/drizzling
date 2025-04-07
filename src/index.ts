import {config} from "dotenv";
config();

import { Hono } from 'hono'
import bookRouter from './routes/ books.js';
import {serve} from "@hono/node-server"
import { getPgClient } from "./scripts/migrate.js";
import {drizzle} from "drizzle-orm/postgres-js"
import { globalSchema } from "./db/index-schema.js";
import { user } from "./application/schemas/book.schema.js";
import { sql } from "drizzle-orm";

const pgClient = getPgClient();
const db = drizzle(pgClient, {
  logger: false,
  schema: globalSchema,
});

db.delete(user).then(() => {
  console.log("delete users");
});

db.insert(user).values({
  email: "echina725@gmail.com",
  name: "Guilherme China",
  role: "ADMIN"
}).returning({
  id: user.id
}).then((r) => {
  console.log(r)
});

db.query.user.findFirst({
  extras: {
    uppercaseName: sql<string>`upper(${user.name})`.as("uppercaseName")
  }
}).then((r) => {
  console.log(r)
})

const app = new Hono();
app.route("/books", bookRouter);

serve({
  fetch: app.fetch,
  port: 3000 
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
