import { db } from "../server/db";
import { reviews, cuisines, nycEatsCategories, topTenLists, topTenListItems, socialSettings, socialEmbeds, pageHeaders, reviewsCuisines, reviewsNycCategories } from "../shared/schema";
import * as fs from "fs";
import * as path from "path";

async function exportStaticData() {
  console.log("Exporting static data from database...");

  const outputDir = path.join(process.cwd(), "client", "src", "data");
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
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
  };

  fs.writeFileSync(
    path.join(outputDir, "static-data.json"),
    JSON.stringify(staticData, null, 2)
  );

  console.log(`Exported ${allReviews.length} reviews`);
  console.log(`Exported ${allCuisines.length} cuisines`);
  console.log(`Exported ${allNycCategories.length} NYC categories`);
  console.log(`Exported ${allTopTenLists.length} top 10 lists`);
  console.log(`Exported ${allSocialSettings.length} social settings`);
  console.log(`Exported ${allPageHeaders.length} page headers`);
  console.log("Static data export complete!");

  process.exit(0);
}

exportStaticData().catch((err) => {
  console.error("Failed to export static data:", err);
  process.exit(1);
});
