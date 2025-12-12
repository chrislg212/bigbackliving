import { db } from "../server/db";
import { reviews, cuisines, nycEatsCategories, topTenLists, topTenListItems, socialSettings, socialEmbeds, pageHeaders, reviewsCuisines, reviewsNycCategories, regions, locationCategories, reviewsLocationCategories } from "../shared/schema";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

function parseObjectPath(objectPath: string): { bucketName: string; objectName: string } | null {
  if (!objectPath.startsWith("/objects/")) {
    return null;
  }
  const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!privateObjectDir) return null;
  
  const entityId = objectPath.slice("/objects/".length);
  const fullPath = privateObjectDir.endsWith("/") 
    ? `${privateObjectDir}${entityId}`
    : `${privateObjectDir}/${entityId}`;
  
  const pathParts = fullPath.startsWith("/") ? fullPath.slice(1).split("/") : fullPath.split("/");
  if (pathParts.length < 2) return null;
  
  return {
    bucketName: pathParts[0],
    objectName: pathParts.slice(1).join("/"),
  };
}

async function downloadAndSaveImage(imagePath: string, outputDir: string): Promise<string> {
  if (!imagePath || !imagePath.startsWith("/objects/")) {
    return imagePath;
  }
  
  const parsed = parseObjectPath(imagePath);
  if (!parsed) {
    console.warn(`Could not parse image path: ${imagePath}`);
    return imagePath;
  }
  
  try {
    const bucket = objectStorageClient.bucket(parsed.bucketName);
    const file = bucket.file(parsed.objectName);
    
    const [exists] = await file.exists();
    if (!exists) {
      console.warn(`File does not exist: ${imagePath}`);
      return imagePath;
    }
    
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "image/jpeg";
    
    let extension = ".jpg";
    if (contentType.includes("png")) extension = ".png";
    else if (contentType.includes("gif")) extension = ".gif";
    else if (contentType.includes("webp")) extension = ".webp";
    else if (contentType.includes("svg")) extension = ".svg";
    
    const objectId = imagePath.split("/").pop() || "unknown";
    const filename = `${objectId}${extension}`;
    const localPath = path.join(outputDir, filename);
    
    await file.download({ destination: localPath });
    console.log(`Downloaded: ${imagePath} -> /images/${filename}`);
    
    return `/images/${filename}`;
  } catch (error) {
    console.warn(`Could not download ${imagePath}:`, error);
    return imagePath;
  }
}

async function exportStaticData() {
  console.log("Exporting static data from database...");

  const dataOutputDir = path.join(process.cwd(), "client", "src", "data");
  const imagesOutputDir = path.join(process.cwd(), "client", "public", "images");
  
  if (!fs.existsSync(dataOutputDir)) {
    fs.mkdirSync(dataOutputDir, { recursive: true });
  }
  
  if (!fs.existsSync(imagesOutputDir)) {
    fs.mkdirSync(imagesOutputDir, { recursive: true });
  }

  const allReviews = await db.select().from(reviews);
  const allCuisines = await db.select().from(cuisines);
  const allNycCategories = await db.select().from(nycEatsCategories);
  const allTopTenLists = await db.select().from(topTenLists);
  const allTopTenListItems = await db.select().from(topTenListItems);
  const allSocialSettings = await db.select().from(socialSettings);
  const allSocialEmbeds = await db.select().from(socialEmbeds);
  const allPageHeaders = await db.select().from(pageHeaders);
  const allReviewsCuisines = await db.select().from(reviewsCuisines);
  const allReviewsNycCategories = await db.select().from(reviewsNycCategories);
  const allRegions = await db.select().from(regions);
  const allLocationCategories = await db.select().from(locationCategories);
  const allReviewsLocationCategories = await db.select().from(reviewsLocationCategories);

  console.log("Downloading images from object storage...");
  
  for (const review of allReviews) {
    if (review.image) {
      review.image = await downloadAndSaveImage(review.image, imagesOutputDir);
    }
    if (review.galleryImages && Array.isArray(review.galleryImages)) {
      for (const galleryImage of review.galleryImages) {
        if (galleryImage.url) {
          galleryImage.url = await downloadAndSaveImage(galleryImage.url, imagesOutputDir);
        }
      }
    }
  }
  
  for (const cuisine of allCuisines) {
    if (cuisine.image) {
      cuisine.image = await downloadAndSaveImage(cuisine.image, imagesOutputDir);
    }
  }
  
  for (const category of allNycCategories) {
    if (category.image) {
      category.image = await downloadAndSaveImage(category.image, imagesOutputDir);
    }
  }
  
  for (const list of allTopTenLists) {
    if (list.image) {
      list.image = await downloadAndSaveImage(list.image, imagesOutputDir);
    }
  }
  
  for (const header of allPageHeaders) {
    if (header.image) {
      header.image = await downloadAndSaveImage(header.image, imagesOutputDir);
    }
  }
  
  for (const region of allRegions) {
    if (region.image) {
      region.image = await downloadAndSaveImage(region.image, imagesOutputDir);
    }
  }
  
  for (const locCategory of allLocationCategories) {
    if (locCategory.image) {
      locCategory.image = await downloadAndSaveImage(locCategory.image, imagesOutputDir);
    }
  }

  const reviewCuisineMap: Record<number, number[]> = {};
  for (const rc of allReviewsCuisines) {
    if (!reviewCuisineMap[rc.reviewId]) {
      reviewCuisineMap[rc.reviewId] = [];
    }
    reviewCuisineMap[rc.reviewId].push(rc.cuisineId);
  }

  const reviewNycCategoryMap: Record<number, number[]> = {};
  for (const rnc of allReviewsNycCategories) {
    if (!reviewNycCategoryMap[rnc.reviewId]) {
      reviewNycCategoryMap[rnc.reviewId] = [];
    }
    reviewNycCategoryMap[rnc.reviewId].push(rnc.nycCategoryId);
  }

  const reviewLocationCategoryMap: Record<number, number[]> = {};
  for (const rlc of allReviewsLocationCategories) {
    if (!reviewLocationCategoryMap[rlc.reviewId]) {
      reviewLocationCategoryMap[rlc.reviewId] = [];
    }
    reviewLocationCategoryMap[rlc.reviewId].push(rlc.locationCategoryId);
  }

  const staticData = {
    reviews: allReviews,
    cuisines: allCuisines,
    nycCategories: allNycCategories,
    topTenLists: allTopTenLists,
    topTenListItems: allTopTenListItems,
    socialSettings: allSocialSettings,
    socialEmbeds: allSocialEmbeds,
    pageHeaders: allPageHeaders,
    reviewCuisineMap,
    reviewNycCategoryMap,
    regions: allRegions,
    locationCategories: allLocationCategories,
    reviewLocationCategoryMap,
  };

  fs.writeFileSync(
    path.join(dataOutputDir, "static-data.json"),
    JSON.stringify(staticData, null, 2)
  );

  console.log(`Exported ${allReviews.length} reviews`);
  console.log(`Exported ${allCuisines.length} cuisines`);
  console.log(`Exported ${allNycCategories.length} NYC categories`);
  console.log(`Exported ${allTopTenLists.length} top 10 lists`);
  console.log(`Exported ${allSocialSettings.length} social settings`);
  console.log(`Exported ${allPageHeaders.length} page headers`);
  console.log(`Exported ${allRegions.length} regions`);
  console.log(`Exported ${allLocationCategories.length} location categories`);
  console.log("Static data export complete!");

  process.exit(0);
}

exportStaticData().catch((err) => {
  console.error("Failed to export static data:", err);
  process.exit(1);
});
