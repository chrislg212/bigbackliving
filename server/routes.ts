import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema, insertCuisineSchema, insertNycEatsCategorySchema, insertTopTenListSchema, insertSocialSettingsSchema, insertSocialEmbedSchema, insertPageHeaderSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Get single review by slug
  app.get("/api/reviews/:slug", async (req, res) => {
    try {
      const review = await storage.getReviewBySlug(req.params.slug);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ error: "Failed to fetch review" });
    }
  });

  // Create new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const parsed = insertReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const review = await storage.createReview(parsed.data);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Update review
  app.patch("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const parsed = insertReviewSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const review = await storage.updateReview(id, parsed.data);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  // Delete review
  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const deleted = await storage.deleteReview(id);
      if (!deleted) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Get upload URL for object storage
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Update image with ACL policy
  app.put("/api/review-images", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: "admin",
          visibility: "public",
        },
      );
      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting review image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Generic public image upload with ACL policy
  app.put("/api/public-images", async (req, res) => {
    const imageUrl = req.body.imageUrl || req.body.imageURL;
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }
    try {
      const objectStorageService = new ObjectStorageService();
      const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(
        imageUrl,
        {
          owner: "admin",
          visibility: "public",
        },
      );
      res.status(200).json({ normalizedPath });
    } catch (error) {
      console.error("Error setting public image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Cuisines routes
  app.get("/api/cuisines", async (req, res) => {
    try {
      const cuisines = await storage.getAllCuisines();
      res.json(cuisines);
    } catch (error) {
      console.error("Error fetching cuisines:", error);
      res.status(500).json({ error: "Failed to fetch cuisines" });
    }
  });

  app.get("/api/cuisines/:slug", async (req, res) => {
    try {
      const cuisine = await storage.getCuisineBySlug(req.params.slug);
      if (!cuisine) {
        return res.status(404).json({ error: "Cuisine not found" });
      }
      const reviews = await storage.getReviewsByCuisine(cuisine.id);
      res.json({ cuisine, reviews });
    } catch (error) {
      console.error("Error fetching cuisine:", error);
      res.status(500).json({ error: "Failed to fetch cuisine" });
    }
  });

  app.post("/api/cuisines", async (req, res) => {
    try {
      const parsed = insertCuisineSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const cuisine = await storage.createCuisine(parsed.data);
      res.status(201).json(cuisine);
    } catch (error) {
      console.error("Error creating cuisine:", error);
      res.status(500).json({ error: "Failed to create cuisine" });
    }
  });

  app.patch("/api/cuisines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid cuisine ID" });
      }
      const parsed = insertCuisineSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const cuisine = await storage.updateCuisine(id, parsed.data);
      if (!cuisine) {
        return res.status(404).json({ error: "Cuisine not found" });
      }
      res.json(cuisine);
    } catch (error) {
      console.error("Error updating cuisine:", error);
      res.status(500).json({ error: "Failed to update cuisine" });
    }
  });

  app.delete("/api/cuisines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid cuisine ID" });
      }
      const deleted = await storage.deleteCuisine(id);
      if (!deleted) {
        return res.status(404).json({ error: "Cuisine not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting cuisine:", error);
      res.status(500).json({ error: "Failed to delete cuisine" });
    }
  });

  // NYC Eats Categories routes
  app.get("/api/nyc-eats", async (req, res) => {
    try {
      const categories = await storage.getAllNycEatsCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching NYC eats categories:", error);
      res.status(500).json({ error: "Failed to fetch NYC eats categories" });
    }
  });

  app.get("/api/nyc-eats/:slug", async (req, res) => {
    try {
      const category = await storage.getNycEatsCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const reviews = await storage.getReviewsByNycCategory(category.id);
      res.json({ category, reviews });
    } catch (error) {
      console.error("Error fetching NYC eats category:", error);
      res.status(500).json({ error: "Failed to fetch NYC eats category" });
    }
  });

  app.post("/api/nyc-eats", async (req, res) => {
    try {
      const parsed = insertNycEatsCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const category = await storage.createNycEatsCategory(parsed.data);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating NYC eats category:", error);
      res.status(500).json({ error: "Failed to create NYC eats category" });
    }
  });

  app.patch("/api/nyc-eats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const parsed = insertNycEatsCategorySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const category = await storage.updateNycEatsCategory(id, parsed.data);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating NYC eats category:", error);
      res.status(500).json({ error: "Failed to update NYC eats category" });
    }
  });

  app.delete("/api/nyc-eats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const deleted = await storage.deleteNycEatsCategory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting NYC eats category:", error);
      res.status(500).json({ error: "Failed to delete NYC eats category" });
    }
  });

  // Top Ten Lists routes
  app.get("/api/top-ten-lists", async (req, res) => {
    try {
      const lists = await storage.getAllTopTenLists();
      res.json(lists);
    } catch (error) {
      console.error("Error fetching top ten lists:", error);
      res.status(500).json({ error: "Failed to fetch top ten lists" });
    }
  });

  app.get("/api/top-ten-lists/:slug", async (req, res) => {
    try {
      const list = await storage.getTopTenListBySlug(req.params.slug);
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }
      const items = await storage.getTopTenListItems(list.id);
      res.json({ list, items });
    } catch (error) {
      console.error("Error fetching top ten list:", error);
      res.status(500).json({ error: "Failed to fetch top ten list" });
    }
  });

  app.post("/api/top-ten-lists", async (req, res) => {
    try {
      const parsed = insertTopTenListSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const list = await storage.createTopTenList(parsed.data);
      res.status(201).json(list);
    } catch (error) {
      console.error("Error creating top ten list:", error);
      res.status(500).json({ error: "Failed to create top ten list" });
    }
  });

  app.patch("/api/top-ten-lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid list ID" });
      }
      const parsed = insertTopTenListSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const list = await storage.updateTopTenList(id, parsed.data);
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }
      res.json(list);
    } catch (error) {
      console.error("Error updating top ten list:", error);
      res.status(500).json({ error: "Failed to update top ten list" });
    }
  });

  app.delete("/api/top-ten-lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid list ID" });
      }
      const deleted = await storage.deleteTopTenList(id);
      if (!deleted) {
        return res.status(404).json({ error: "List not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting top ten list:", error);
      res.status(500).json({ error: "Failed to delete top ten list" });
    }
  });

  app.put("/api/top-ten-lists/:id/items", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid list ID" });
      }
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Items must be an array" });
      }
      await storage.setTopTenListItems(id, items);
      const updatedItems = await storage.getTopTenListItems(id);
      res.json(updatedItems);
    } catch (error) {
      console.error("Error updating top ten list items:", error);
      res.status(500).json({ error: "Failed to update top ten list items" });
    }
  });

  // Review category assignments
  app.get("/api/reviews/:id/cuisines", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const cuisines = await storage.getReviewCuisines(id);
      res.json(cuisines);
    } catch (error) {
      console.error("Error fetching review cuisines:", error);
      res.status(500).json({ error: "Failed to fetch review cuisines" });
    }
  });

  app.put("/api/reviews/:id/cuisines", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const { cuisineIds } = req.body;
      if (!Array.isArray(cuisineIds)) {
        return res.status(400).json({ error: "cuisineIds must be an array" });
      }
      await storage.setReviewCuisines(id, cuisineIds);
      const cuisines = await storage.getReviewCuisines(id);
      res.json(cuisines);
    } catch (error) {
      console.error("Error updating review cuisines:", error);
      res.status(500).json({ error: "Failed to update review cuisines" });
    }
  });

  app.get("/api/reviews/:id/nyc-categories", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const categories = await storage.getReviewNycCategories(id);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching review NYC categories:", error);
      res.status(500).json({ error: "Failed to fetch review NYC categories" });
    }
  });

  app.put("/api/reviews/:id/nyc-categories", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const { categoryIds } = req.body;
      if (!Array.isArray(categoryIds)) {
        return res.status(400).json({ error: "categoryIds must be an array" });
      }
      await storage.setReviewNycCategories(id, categoryIds);
      const categories = await storage.getReviewNycCategories(id);
      res.json(categories);
    } catch (error) {
      console.error("Error updating review NYC categories:", error);
      res.status(500).json({ error: "Failed to update review NYC categories" });
    }
  });

  // Get all social settings
  app.get("/api/social-settings", async (req, res) => {
    try {
      const settings = await storage.getAllSocialSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching social settings:", error);
      res.status(500).json({ error: "Failed to fetch social settings" });
    }
  });

  // Create or update social settings
  app.put("/api/social-settings", async (req, res) => {
    try {
      const parsed = insertSocialSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const settings = await storage.upsertSocialSettings(parsed.data);
      res.json(settings);
    } catch (error) {
      console.error("Error updating social settings:", error);
      res.status(500).json({ error: "Failed to update social settings" });
    }
  });

  // Social Embeds routes
  app.get("/api/social-embeds", async (req, res) => {
    try {
      const platform = req.query.platform as string | undefined;
      const embeds = platform 
        ? await storage.getSocialEmbedsByPlatform(platform)
        : await storage.getAllSocialEmbeds();
      res.json(embeds);
    } catch (error) {
      console.error("Error fetching social embeds:", error);
      res.status(500).json({ error: "Failed to fetch social embeds" });
    }
  });

  app.post("/api/social-embeds", async (req, res) => {
    try {
      const parsed = insertSocialEmbedSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const embed = await storage.createSocialEmbed(parsed.data);
      res.status(201).json(embed);
    } catch (error) {
      console.error("Error creating social embed:", error);
      res.status(500).json({ error: "Failed to create social embed" });
    }
  });

  app.patch("/api/social-embeds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid embed ID" });
      }
      const parsed = insertSocialEmbedSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const embed = await storage.updateSocialEmbed(id, parsed.data);
      if (!embed) {
        return res.status(404).json({ error: "Embed not found" });
      }
      res.json(embed);
    } catch (error) {
      console.error("Error updating social embed:", error);
      res.status(500).json({ error: "Failed to update social embed" });
    }
  });

  app.delete("/api/social-embeds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid embed ID" });
      }
      const deleted = await storage.deleteSocialEmbed(id);
      if (!deleted) {
        return res.status(404).json({ error: "Embed not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting social embed:", error);
      res.status(500).json({ error: "Failed to delete social embed" });
    }
  });

  // Page Headers routes
  app.get("/api/page-headers", async (req, res) => {
    try {
      const headers = await storage.getAllPageHeaders();
      res.json(headers);
    } catch (error) {
      console.error("Error fetching page headers:", error);
      res.status(500).json({ error: "Failed to fetch page headers" });
    }
  });

  app.get("/api/page-headers/:pageSlug", async (req, res) => {
    try {
      const header = await storage.getPageHeaderBySlug(req.params.pageSlug);
      if (!header) {
        return res.status(404).json({ error: "Page header not found" });
      }
      res.json(header);
    } catch (error) {
      console.error("Error fetching page header:", error);
      res.status(500).json({ error: "Failed to fetch page header" });
    }
  });

  app.put("/api/page-headers", async (req, res) => {
    try {
      const parsed = insertPageHeaderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const header = await storage.upsertPageHeader(parsed.data);
      res.json(header);
    } catch (error) {
      console.error("Error updating page header:", error);
      res.status(500).json({ error: "Failed to update page header" });
    }
  });

  return httpServer;
}
