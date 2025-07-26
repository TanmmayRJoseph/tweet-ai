import {pgTable,serial,text,timestamp,varchar,uuid,} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tweets Table
export const tweets = pgTable("tweets", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  mood: varchar("mood", { length: 20 }).notNull(), // funny | sarcastic | motivational
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Optional: Relations for joins
export const usersRelations = relations(users, ({ many }) => ({
  tweets: many(tweets),
}));

export const tweetsRelations = relations(tweets, ({ one }) => ({
  user: one(users, {
    fields: [tweets.userId],
    references: [users.id],
  }),
}));
