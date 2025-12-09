import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, serial, integer } from "drizzle-orm/pg-core";
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

export const cuisines = pgTable("cuisines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const insertCuisineSchema = createInsertSchema(cuisines).omit({
  id: true,
});

export type InsertCuisine = z.infer<typeof insertCuisineSchema>;
export type Cuisine = typeof cuisines.$inferSelect;

export const nycEatsCategories = pgTable("nyc_eats_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const insertNycEatsCategorySchema = createInsertSchema(nycEatsCategories).omit({
  id: true,
});

export type InsertNycEatsCategory = z.infer<typeof insertNycEatsCategorySchema>;
export type NycEatsCategory = typeof nycEatsCategories.$inferSelect;

export const topTenLists = pgTable("top_ten_lists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const insertTopTenListSchema = createInsertSchema(topTenLists).omit({
  id: true,
});

export type InsertTopTenList = z.infer<typeof insertTopTenListSchema>;
export type TopTenList = typeof topTenLists.$inferSelect;

export const reviewsCuisines = pgTable("reviews_cuisines", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  cuisineId: integer("cuisine_id").notNull().references(() => cuisines.id, { onDelete: "cascade" }),
});

export const reviewsNycCategories = pgTable("reviews_nyc_categories", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  nycCategoryId: integer("nyc_category_id").notNull().references(() => nycEatsCategories.id, { onDelete: "cascade" }),
});

export const topTenListItems = pgTable("top_ten_list_items", {
  id: serial("id").primaryKey(),
  listId: integer("list_id").notNull().references(() => topTenLists.id, { onDelete: "cascade" }),
  reviewId: integer("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  rank: integer("rank").notNull(),
});

export const socialSettings = pgTable("social_settings", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().unique(),
  username: text("username").notNull(),
  profileUrl: text("profile_url").notNull(),
});

export const insertSocialSettingsSchema = createInsertSchema(socialSettings).omit({
  id: true,
});

export type InsertSocialSettings = z.infer<typeof insertSocialSettingsSchema>;
export type SocialSettings = typeof socialSettings.$inferSelect;

export const socialEmbeds = pgTable("social_embeds", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  title: text("title"),
  embedCode: text("embed_code").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const insertSocialEmbedSchema = createInsertSchema(socialEmbeds).omit({
  id: true,
});

export type InsertSocialEmbed = z.infer<typeof insertSocialEmbedSchema>;
export type SocialEmbed = typeof socialEmbeds.$inferSelect;

export const pageHeaders = pgTable("page_headers", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  image: text("image"),
});

export const insertPageHeaderSchema = createInsertSchema(pageHeaders).omit({
  id: true,
});

export type InsertPageHeader = z.infer<typeof insertPageHeaderSchema>;
export type PageHeader = typeof pageHeaders.$inferSelect;
