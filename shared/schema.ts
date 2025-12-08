import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  location: text("location").notNull(),
  rating: real("rating").notNull(),
  excerpt: text("excerpt").notNull(),
  image: text("image"),
  priceRange: text("price_range").notNull(),
  fullReview: text("full_review"),
  highlights: text("highlights").array(),
  atmosphere: text("atmosphere"),
  mustTry: text("must_try").array(),
  visitDate: text("visit_date"),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
