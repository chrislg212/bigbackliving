import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema, insertCuisineSchema, insertNycEatsCategorySchema, insertTopTenListSchema, insertSocialSettingsSchema, insertSocialEmbedSchema, insertPageHeaderSchema, insertContactSubmissionSchema } from "@shared/schema";
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

  // Contact Submissions routes
  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  app.post("/api/contact-submissions", async (req, res) => {
    try {
      const parsed = insertContactSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const submission = await storage.createContactSubmission(parsed.data);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(500).json({ error: "Failed to create contact submission" });
    }
  });

  app.patch("/api/contact-submissions/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      const submission = await storage.markContactSubmissionRead(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error marking submission as read:", error);
      res.status(500).json({ error: "Failed to mark submission as read" });
    }
  });

  app.delete("/api/contact-submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      const deleted = await storage.deleteContactSubmission(id);
      if (!deleted) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      res.status(500).json({ error: "Failed to delete contact submission" });
    }
  });

  // Export all reviews as JSON for syncing between environments
  app.get("/api/export/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      // Remove IDs so they can be imported as new records
      const exportData = reviews.map(({ id, ...rest }) => rest);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="reviews-export.json"');
      res.json({ reviews: exportData, exportedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Error exporting reviews:", error);
      res.status(500).json({ error: "Failed to export reviews" });
    }
  });

  // Import reviews from JSON
  app.post("/api/import/reviews", async (req, res) => {
    try {
      const { reviews } = req.body;
      if (!Array.isArray(reviews)) {
        return res.status(400).json({ error: "Invalid format: reviews array required" });
      }
      
      // Limit number of reviews to prevent resource exhaustion
      if (reviews.length > 100) {
        return res.status(400).json({ error: "Maximum 100 reviews per import" });
      }
      
      const imported: number[] = [];
      const skipped: string[] = [];
      
      // Helper to sanitize slug - only allow alphanumeric and hyphens
      const sanitizeSlug = (slug: string): string => {
        return slug.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 100);
      };
      
      // Helper to strip HTML/script tags and limit length
      const sanitizeText = (text: string | undefined | null, maxLength = 10000): string | undefined => {
        if (!text || typeof text !== 'string') return undefined;
        return text
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '')
          .trim()
          .substring(0, maxLength);
      };
      
      // Helper to validate image URLs - only allow safe protocols
      const sanitizeImageUrl = (url: string | undefined | null): string | undefined => {
        if (!url || typeof url !== 'string') return undefined;
        const trimmed = url.trim().substring(0, 2000);
        // Decode URL to catch encoded javascript:
        let decoded = trimmed;
        try { decoded = decodeURIComponent(trimmed); } catch { /* ignore decode errors */ }
        const lower = decoded.toLowerCase();
        // Block dangerous schemes
        if (lower.includes('javascript:') || lower.includes('data:') || lower.includes('vbscript:')) {
          return undefined;
        }
        // Only allow http/https protocols or relative paths
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
          return trimmed;
        }
        return undefined;
      };
      
      // Helper to validate and sanitize date strings
      const sanitizeDate = (date: string | undefined | null): string | undefined => {
        if (!date || typeof date !== 'string') return undefined;
        // Only allow simple date-like strings (max 50 chars, alphanumeric + spaces + punctuation)
        const trimmed = date.trim().substring(0, 50);
        if (/^[a-zA-Z0-9\s,.-]+$/.test(trimmed)) {
          return trimmed;
        }
        return undefined;
      };
      
      // Define allowed fields to prevent prototype pollution
      const allowedFields = ['name', 'slug', 'cuisine', 'location', 'rating', 'excerpt', 'priceRange', 'image', 'fullReview', 'atmosphere', 'visitDate', 'highlights', 'mustTry'];
      
      for (const reviewData of reviews) {
        // Skip prototype pollution attempts (check for explicit properties, not inherited ones)
        if (Object.prototype.hasOwnProperty.call(reviewData, '__proto__') || 
            Object.prototype.hasOwnProperty.call(reviewData, 'constructor') || 
            Object.prototype.hasOwnProperty.call(reviewData, 'prototype')) {
          skipped.push('malicious-payload');
          continue;
        }
        
        // Generate slug from name if not provided, then sanitize
        const rawSlug = reviewData.slug || (reviewData.name ? reviewData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
        const safeSlug = sanitizeSlug(rawSlug);
        if (!safeSlug) {
          skipped.push('invalid-slug');
          continue;
        }
        
        // Check if review with same slug already exists
        const existing = await storage.getReviewBySlug(safeSlug);
        if (existing) {
          skipped.push(safeSlug);
          continue;
        }
        
        // Build sanitized data with only allowed fields
        const sanitizedData: Record<string, unknown> = {};
        for (const key of allowedFields) {
          if (key in reviewData) {
            if (key === 'highlights' || key === 'mustTry') {
              // Sanitize array items - strictly reject non-string values
              if (Array.isArray(reviewData[key])) {
                const validItems: string[] = [];
                for (const item of reviewData[key]) {
                  // Only accept primitive strings, reject objects/arrays/functions
                  if (typeof item === 'string' && item.length < 500 && Object.prototype.toString.call(item) === '[object String]') {
                    const sanitized = sanitizeText(item, 500);
                    if (sanitized) validItems.push(sanitized);
                  }
                  if (validItems.length >= 20) break; // Max 20 items
                }
                sanitizedData[key] = validItems;
              }
            } else if (key === 'image') {
              sanitizedData[key] = sanitizeImageUrl(reviewData[key]);
            } else if (key === 'visitDate') {
              sanitizedData[key] = sanitizeDate(reviewData[key]);
            } else if (key === 'rating') {
              const rating = parseFloat(reviewData[key]);
              if (!isNaN(rating) && rating >= 1 && rating <= 5) {
                sanitizedData[key] = Math.round(rating * 10) / 10;
              }
            } else if (typeof reviewData[key] === 'string') {
              sanitizedData[key] = sanitizeText(reviewData[key]);
            } else {
              sanitizedData[key] = reviewData[key];
            }
          }
        }
        sanitizedData.slug = safeSlug;
        
        // Validate the sanitized data using the schema
        const parsed = insertReviewSchema.safeParse(sanitizedData);
        if (!parsed.success) {
          skipped.push(safeSlug || 'unknown');
          continue;
        }
        
        const review = await storage.createReview(parsed.data);
        imported.push(review.id);
      }
      
      res.json({ 
        message: `Imported ${imported.length} reviews, skipped ${skipped.length} (already exist or invalid)`,
        imported: imported.length,
        skipped: skipped.length,
        skippedSlugs: skipped
      });
    } catch (error) {
      console.error("Error importing reviews:", error);
      res.status(500).json({ error: "Failed to import reviews" });
    }
  });

  return httpServer;
}
