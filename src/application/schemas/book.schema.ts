import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "BASIC"]);

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age"),
    email: varchar("email", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("BASIC").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("emailIdx").on(t.email),
    unique("uniqueNameAndEmail").on(t.name, t.email),
  ]
);

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom(),
  emailUpdates: boolean("email_updates").notNull().default(false),
  userId: uuid("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull().unique(),
  avgRating: real("avg_rating").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  authorId: uuid("author_id").references(() => user.id),
});

export const category = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
});

export const postCategory = pgTable(
  "postCategory",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id),
    category: uuid("category_id")
      .notNull()
      .references(() => category.id),
  },
  // composite primary key
  (t) => [primaryKey({ columns: [t.postId, t.category] })]
);
