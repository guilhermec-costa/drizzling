import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age"),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
    .notNull(),
});