import { 
  type User, type InsertUser, 
  type Review, type InsertReview, 
  type Cuisine, type InsertCuisine,
  type NycEatsCategory, type InsertNycEatsCategory,
  type TopTenList, type InsertTopTenList,
  type SocialSettings, type InsertSocialSettings,
  reviews, users, cuisines, nycEatsCategories, topTenLists,
  reviewsCuisines, reviewsNycCategories, topTenListItems, socialSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllReviews(): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  getReviewBySlug(slug: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  
  getAllCuisines(): Promise<Cuisine[]>;
  getCuisineById(id: number): Promise<Cuisine | undefined>;
  getCuisineBySlug(slug: string): Promise<Cuisine | undefined>;
  createCuisine(cuisine: InsertCuisine): Promise<Cuisine>;
  updateCuisine(id: number, cuisine: Partial<InsertCuisine>): Promise<Cuisine | undefined>;
  deleteCuisine(id: number): Promise<boolean>;
  
  getAllNycEatsCategories(): Promise<NycEatsCategory[]>;
  getNycEatsCategoryById(id: number): Promise<NycEatsCategory | undefined>;
  getNycEatsCategoryBySlug(slug: string): Promise<NycEatsCategory | undefined>;
  createNycEatsCategory(category: InsertNycEatsCategory): Promise<NycEatsCategory>;
  updateNycEatsCategory(id: number, category: Partial<InsertNycEatsCategory>): Promise<NycEatsCategory | undefined>;
  deleteNycEatsCategory(id: number): Promise<boolean>;
  
  getAllTopTenLists(): Promise<TopTenList[]>;
  getTopTenListById(id: number): Promise<TopTenList | undefined>;
  getTopTenListBySlug(slug: string): Promise<TopTenList | undefined>;
  createTopTenList(list: InsertTopTenList): Promise<TopTenList>;
  updateTopTenList(id: number, list: Partial<InsertTopTenList>): Promise<TopTenList | undefined>;
  deleteTopTenList(id: number): Promise<boolean>;
  
  getReviewCuisines(reviewId: number): Promise<Cuisine[]>;
  setReviewCuisines(reviewId: number, cuisineIds: number[]): Promise<void>;
  getReviewsByCuisine(cuisineId: number): Promise<Review[]>;
  
  getReviewNycCategories(reviewId: number): Promise<NycEatsCategory[]>;
  setReviewNycCategories(reviewId: number, categoryIds: number[]): Promise<void>;
  getReviewsByNycCategory(categoryId: number): Promise<Review[]>;
  
  getTopTenListItems(listId: number): Promise<{ review: Review; rank: number }[]>;
  setTopTenListItems(listId: number, items: { reviewId: number; rank: number }[]): Promise<void>;
  
  getAllSocialSettings(): Promise<SocialSettings[]>;
  getSocialSettingsByPlatform(platform: string): Promise<SocialSettings | undefined>;
  upsertSocialSettings(settings: InsertSocialSettings): Promise<SocialSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews);
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewBySlug(slug: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.slug, slug));
    return review;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: number, updateData: Partial<InsertReview>): Promise<Review | undefined> {
    const [review] = await db.update(reviews).set(updateData).where(eq(reviews.id, id)).returning();
    return review;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    return result.length > 0;
  }

  async getAllCuisines(): Promise<Cuisine[]> {
    return db.select().from(cuisines);
  }

  async getCuisineById(id: number): Promise<Cuisine | undefined> {
    const [cuisine] = await db.select().from(cuisines).where(eq(cuisines.id, id));
    return cuisine;
  }

  async getCuisineBySlug(slug: string): Promise<Cuisine | undefined> {
    const [cuisine] = await db.select().from(cuisines).where(eq(cuisines.slug, slug));
    return cuisine;
  }

  async createCuisine(insertCuisine: InsertCuisine): Promise<Cuisine> {
    const [cuisine] = await db.insert(cuisines).values(insertCuisine).returning();
    return cuisine;
  }

  async updateCuisine(id: number, updateData: Partial<InsertCuisine>): Promise<Cuisine | undefined> {
    const [cuisine] = await db.update(cuisines).set(updateData).where(eq(cuisines.id, id)).returning();
    return cuisine;
  }

  async deleteCuisine(id: number): Promise<boolean> {
    const result = await db.delete(cuisines).where(eq(cuisines.id, id)).returning();
    return result.length > 0;
  }

  async getAllNycEatsCategories(): Promise<NycEatsCategory[]> {
    return db.select().from(nycEatsCategories);
  }

  async getNycEatsCategoryById(id: number): Promise<NycEatsCategory | undefined> {
    const [category] = await db.select().from(nycEatsCategories).where(eq(nycEatsCategories.id, id));
    return category;
  }

  async getNycEatsCategoryBySlug(slug: string): Promise<NycEatsCategory | undefined> {
    const [category] = await db.select().from(nycEatsCategories).where(eq(nycEatsCategories.slug, slug));
    return category;
  }

  async createNycEatsCategory(insertCategory: InsertNycEatsCategory): Promise<NycEatsCategory> {
    const [category] = await db.insert(nycEatsCategories).values(insertCategory).returning();
    return category;
  }

  async updateNycEatsCategory(id: number, updateData: Partial<InsertNycEatsCategory>): Promise<NycEatsCategory | undefined> {
    const [category] = await db.update(nycEatsCategories).set(updateData).where(eq(nycEatsCategories.id, id)).returning();
    return category;
  }

  async deleteNycEatsCategory(id: number): Promise<boolean> {
    const result = await db.delete(nycEatsCategories).where(eq(nycEatsCategories.id, id)).returning();
    return result.length > 0;
  }

  async getAllTopTenLists(): Promise<TopTenList[]> {
    return db.select().from(topTenLists);
  }

  async getTopTenListById(id: number): Promise<TopTenList | undefined> {
    const [list] = await db.select().from(topTenLists).where(eq(topTenLists.id, id));
    return list;
  }

  async getTopTenListBySlug(slug: string): Promise<TopTenList | undefined> {
    const [list] = await db.select().from(topTenLists).where(eq(topTenLists.slug, slug));
    return list;
  }

  async createTopTenList(insertList: InsertTopTenList): Promise<TopTenList> {
    const [list] = await db.insert(topTenLists).values(insertList).returning();
    return list;
  }

  async updateTopTenList(id: number, updateData: Partial<InsertTopTenList>): Promise<TopTenList | undefined> {
    const [list] = await db.update(topTenLists).set(updateData).where(eq(topTenLists.id, id)).returning();
    return list;
  }

  async deleteTopTenList(id: number): Promise<boolean> {
    const result = await db.delete(topTenLists).where(eq(topTenLists.id, id)).returning();
    return result.length > 0;
  }

  async getReviewCuisines(reviewId: number): Promise<Cuisine[]> {
    const links = await db.select().from(reviewsCuisines).where(eq(reviewsCuisines.reviewId, reviewId));
    const cuisineList: Cuisine[] = [];
    for (const link of links) {
      const cuisine = await this.getCuisineById(link.cuisineId);
      if (cuisine) cuisineList.push(cuisine);
    }
    return cuisineList;
  }

  async setReviewCuisines(reviewId: number, cuisineIds: number[]): Promise<void> {
    await db.delete(reviewsCuisines).where(eq(reviewsCuisines.reviewId, reviewId));
    if (cuisineIds.length > 0) {
      await db.insert(reviewsCuisines).values(cuisineIds.map(cuisineId => ({ reviewId, cuisineId })));
    }
  }

  async getReviewsByCuisine(cuisineId: number): Promise<Review[]> {
    const links = await db.select().from(reviewsCuisines).where(eq(reviewsCuisines.cuisineId, cuisineId));
    const reviewList: Review[] = [];
    for (const link of links) {
      const review = await this.getReviewById(link.reviewId);
      if (review) reviewList.push(review);
    }
    return reviewList;
  }

  async getReviewNycCategories(reviewId: number): Promise<NycEatsCategory[]> {
    const links = await db.select().from(reviewsNycCategories).where(eq(reviewsNycCategories.reviewId, reviewId));
    const categoryList: NycEatsCategory[] = [];
    for (const link of links) {
      const category = await this.getNycEatsCategoryById(link.nycCategoryId);
      if (category) categoryList.push(category);
    }
    return categoryList;
  }

  async setReviewNycCategories(reviewId: number, categoryIds: number[]): Promise<void> {
    await db.delete(reviewsNycCategories).where(eq(reviewsNycCategories.reviewId, reviewId));
    if (categoryIds.length > 0) {
      await db.insert(reviewsNycCategories).values(categoryIds.map(nycCategoryId => ({ reviewId, nycCategoryId })));
    }
  }

  async getReviewsByNycCategory(categoryId: number): Promise<Review[]> {
    const links = await db.select().from(reviewsNycCategories).where(eq(reviewsNycCategories.nycCategoryId, categoryId));
    const reviewList: Review[] = [];
    for (const link of links) {
      const review = await this.getReviewById(link.reviewId);
      if (review) reviewList.push(review);
    }
    return reviewList;
  }

  async getTopTenListItems(listId: number): Promise<{ review: Review; rank: number }[]> {
    const items = await db.select().from(topTenListItems).where(eq(topTenListItems.listId, listId));
    const result: { review: Review; rank: number }[] = [];
    for (const item of items) {
      const review = await this.getReviewById(item.reviewId);
      if (review) result.push({ review, rank: item.rank });
    }
    return result.sort((a, b) => a.rank - b.rank);
  }

  async setTopTenListItems(listId: number, items: { reviewId: number; rank: number }[]): Promise<void> {
    await db.delete(topTenListItems).where(eq(topTenListItems.listId, listId));
    if (items.length > 0) {
      await db.insert(topTenListItems).values(items.map(item => ({ listId, reviewId: item.reviewId, rank: item.rank })));
    }
  }

  async getAllSocialSettings(): Promise<SocialSettings[]> {
    return db.select().from(socialSettings);
  }

  async getSocialSettingsByPlatform(platform: string): Promise<SocialSettings | undefined> {
    const [settings] = await db.select().from(socialSettings).where(eq(socialSettings.platform, platform));
    return settings;
  }

  async upsertSocialSettings(insertSettings: InsertSocialSettings): Promise<SocialSettings> {
    const existing = await this.getSocialSettingsByPlatform(insertSettings.platform);
    if (existing) {
      const [updated] = await db.update(socialSettings)
        .set(insertSettings)
        .where(eq(socialSettings.platform, insertSettings.platform))
        .returning();
      return updated;
    }
    const [created] = await db.insert(socialSettings).values(insertSettings).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
