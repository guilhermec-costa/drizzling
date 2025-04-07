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

import {relations, type InferSelectModel} from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "BASIC", "MODERATOR", "USER"]);

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

export type UserT = InferSelectModel<typeof user>;

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
    categoryId: uuid("category_id")
      .notNull()
      .references(() => category.id),
  },
  // composite primary key
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })]
);

// relations

export const userRelations = relations(user, ({ one, many }) => {
  return {
    // user has one userPreference
    preferences: one(userPreferences),
    posts: many(post)
  }
})

export const userPreferenceRelations = relations(userPreferences, ({ one, many }) => {
  return {
    user: one(user, {
      fields: [userPreferences.userId],
      references: [user.id]
    }),
  }
});

export const postRelations = relations(post, ({ one, many }) => {
  return {
    author: one(user, {
      fields: [post.authorId],
      references: [user.id]
    }),
    postCategories: many(postCategory),
  }
});

export const categoryRelations = relations(category, ({one, many}) => {
  return {
    postCategories: many(postCategory)
  }
})

export const postCategoryRelations = relations(postCategory, ({ one }) => {
  return {
    posts: one(post, {
      fields: [postCategory.postId],
      references: [post.id]
    }),
    categories: one(category, {
      fields: [postCategory.categoryId],
      references: [category.id]
    })
  }
})