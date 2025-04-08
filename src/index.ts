import { config } from "dotenv";
config();

import { getPgClient } from "./scripts/migrate.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { globalSchema } from "./db/index-schema.js";
import {
  user,
  userPreferences,
  type UserT,
} from "./application/schemas/user.schema.js";
import { asc, count, desc, eq, sql } from "drizzle-orm";

const pgClient = getPgClient();
const db = drizzle(pgClient, {
  logger: false,
  schema: globalSchema,
});

(async function () {
  await db.delete(user);
  console.log("Deleted all users");

  const r = await db
    .insert(user)
    .values([
      {
        email: "echina725@gmail.com",
        name: "Guilherme China",
        age: 20,
        role: "ADMIN",
      },
      {
        email: "echina1@gmail.com",
        name: "Edson China",
        age: 53,
        role: "ADMIN",
      },
      {
        email: "ana.silva@gmail.com",
        name: "Ana Silva",
        age: 28,
        role: "USER",
      },
      {
        email: "joao.pereira@gmail.com",
        name: "João Pereira",
        age: 35,
        role: "USER",
      },
      {
        email: "mariana.lopes@gmail.com",
        name: "Mariana Lopes",
        age: 42,
        role: "MODERATOR",
      },
      {
        email: "carlos.souza@gmail.com",
        name: "Carlos Souza",
        age: 31,
        role: "USER",
      },
      {
        email: "bruna.almeida@gmail.com",
        name: "Bruna Almeida",
        age: 25,
        role: "USER",
      },
      {
        email: "fernando.rodrigues@gmail.com",
        name: "Fernando Rodrigues",
        age: 45,
        role: "MODERATOR",
      },
      {
        email: "juliana.martins@gmail.com",
        name: "Juliana Martins",
        age: 38,
        role: "USER",
      },
      {
        email: "roberto.ferreira@gmail.com",
        name: "Roberto Ferreira",
        age: 50,
        role: "ADMIN",
      },
    ])
    .returning();

  const selectedUsers = await db.query.user.findMany({
    columns: {
      id: true,
      email: true,
      name: true,
    },
    extras: {
      uppercaseName: sql<string>`upper(${user.name})`.as("uppercaseName"),
    },
    // relations api
    with: {
      preferences: {
        columns: {
          emailUpdates: true,
          id: true,
        },
      },
      posts: true,
    },
    limit: 15,
    offset: 0,
    orderBy: desc(user.name),
  });

  const results = await db.select({ age: user.age, count: count(user) })
    .from(user)
    .where(sql<boolean>`age > 20`)
    .orderBy(asc(user.age))
    .groupBy(user.age)
  console.log(results);
})();
