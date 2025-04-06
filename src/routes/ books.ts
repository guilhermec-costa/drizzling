import {Hono, type Context, type Next} from "hono"

const bookRouter = new Hono();

bookRouter.get("/", (c) => {
  c.header("X-Context", "Hello world");
  return c.json({
    data: "Book 1"
  });
})

function handler1(ctx: Context, next: Next) {
  console.log(process.env.DB_PWD)
  next();
}

async function handler2(ctx: Context, next: Next) {
  const bookId = ctx.req.param();
  console.log("Handler 2 middleware");
  ctx.header("Id-received", String(bookId));
  return ctx.json({
    data: "Aham"
  });
}

bookRouter.get("/:bookId", handler1, handler2)

export default bookRouter;