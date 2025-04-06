import {config} from "dotenv";
config();

import { Hono } from 'hono'
import bookRouter from './routes/ books.js';
import {serve} from "@hono/node-server"

const app = new Hono();
app.route("/books", bookRouter);

serve({
  fetch: app.fetch,
  port: 3000 
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
