import staticData from "../data/static-data.json";
import type { Review, Cuisine, NycEatsCategory, TopTenList, SocialSettings, SocialEmbed, PageHeader, Region, LocationCategory } from "@shared/schema";

interface StaticData {
  reviews: Review[];
  cuisines: Cuisine[];
  nycCategories: NycEatsCategory[];
  topTenLists: TopTenList[];
  topTenListItems: { id: number; listId: number; reviewId: number; rank: number }[];
  socialSettings: SocialSettings[];
  socialEmbeds: SocialEmbed[];
  pageHeaders: PageHeader[];
  reviewCuisineMap: Record<number, number[]>;
  reviewNycCategoryMap: Record<number, number[]>;
  regions: Region[];
  locationCategories: LocationCategory[];
  reviewLocationCategoryMap: Record<number, number[]>;
}

const data = staticData as unknown as StaticData;

export function getReviews(): Review[] {
  return data.reviews;
}

export function getReviewBySlug(slug: string): Review | undefined {
  return data.reviews.find((r) => r.slug === slug);
}

export function getCuisines(): Cuisine[] {
  return data.cuisines;
}

export function getCuisineBySlug(slug: string): Cuisine | undefined {
  return data.cuisines.find((c) => c.slug === slug);
}

export function getNycCategories(): NycEatsCategory[] {
  return data.nycCategories;
}

export function getNycCategoryBySlug(slug: string): NycEatsCategory | undefined {
  return data.nycCategories.find((c) => c.slug === slug);
}

export function getTopTenLists(): TopTenList[] {
  return data.topTenLists;
}

export function getTopTenListBySlug(slug: string): TopTenList | undefined {
  return data.topTenLists.find((l) => l.slug === slug);
}

export function getTopTenListItems(listId: number): { reviewId: number; rank: number }[] {
  return data.topTenListItems
    .filter((item) => item.listId === listId)
    .sort((a, b) => a.rank - b.rank);
}

export function getSocialSettings(): SocialSettings[] {
  return data.socialSettings;
}

export function getSocialEmbeds(): SocialEmbed[] {
  return data.socialEmbeds.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export function getPageHeaders(): PageHeader[] {
  return data.pageHeaders;
}

export function getPageHeader(pageSlug: string): PageHeader | undefined {
  return data.pageHeaders.find((h) => h.pageSlug === pageSlug);
}

export function getReviewCuisines(reviewId: number): Cuisine[] {
  const cuisineIds = data.reviewCuisineMap[reviewId] || [];
  return data.cuisines.filter((c) => cuisineIds.includes(c.id));
}

export function getReviewNycCategories(reviewId: number): NycEatsCategory[] {
  const categoryIds = data.reviewNycCategoryMap[reviewId] || [];
  return data.nycCategories.filter((c) => categoryIds.includes(c.id));
}

export function getReviewsByCuisine(cuisineId: number): Review[] {
  const reviewIds = Object.entries(data.reviewCuisineMap)
    .filter(([_, cuisineIds]) => cuisineIds.includes(cuisineId))
    .map(([reviewId]) => parseInt(reviewId));
  return data.reviews.filter((r) => reviewIds.includes(r.id));
}

export function getReviewsByNycCategory(categoryId: number): Review[] {
  const reviewIds = Object.entries(data.reviewNycCategoryMap)
    .filter(([_, categoryIds]) => categoryIds.includes(categoryId))
    .map(([reviewId]) => parseInt(reviewId));
  return data.reviews.filter((r) => reviewIds.includes(r.id));
}

export function getTopTenListWithItems(slug: string): { list: TopTenList; items: { review: Review; rank: number }[] } | null {
  const list = data.topTenLists.find((l) => l.slug === slug);
  if (!list) return null;
  
  const listItems = data.topTenListItems
    .filter((item) => item.listId === list.id)
    .sort((a, b) => a.rank - b.rank);
  
  const items = listItems
    .map((item) => {
      const review = data.reviews.find((r) => r.id === item.reviewId);
      if (!review) return null;
      return { review, rank: item.rank };
    })
    .filter((item): item is { review: Review; rank: number } => item !== null);
  
  return { list, items };
}

export function getCuisineWithReviews(slug: string): { cuisine: Cuisine; reviews: Review[] } | null {
  const cuisine = data.cuisines.find((c) => c.slug === slug);
  if (!cuisine) return null;
  
  const reviews = getReviewsByCuisine(cuisine.id);
  return { cuisine, reviews };
}

export function getReviewById(id: number): Review | undefined {
  return data.reviews.find((r) => r.id === id);
}

export function getRegions(): Region[] {
  return data.regions || [];
}

export function getRegionBySlug(slug: string): Region | undefined {
  return (data.regions || []).find((r) => r.slug === slug);
}

export function getLocationCategories(): LocationCategory[] {
  return data.locationCategories || [];
}

export function getLocationCategoriesByRegion(regionId: number): LocationCategory[] {
  return (data.locationCategories || []).filter((c) => c.regionId === regionId);
}

export function getLocationCategoryBySlug(regionSlug: string, categorySlug: string): LocationCategory | undefined {
  const region = getRegionBySlug(regionSlug);
  if (!region) return undefined;
  return (data.locationCategories || []).find((c) => c.regionId === region.id && c.slug === categorySlug);
}

export function getReviewsByLocationCategory(categoryId: number): Review[] {
  const reviewIds = Object.entries(data.reviewLocationCategoryMap || {})
    .filter(([_, categoryIds]) => categoryIds.includes(categoryId))
    .map(([reviewId]) => parseInt(reviewId));
  return data.reviews.filter((r) => reviewIds.includes(r.id));
}

export function getReviewsByRegion(regionSlug: string): Review[] {
  const region = getRegionBySlug(regionSlug);
  if (!region) return [];
  
  const regionCategories = getLocationCategoriesByRegion(region.id);
  const categoryIds = regionCategories.map(c => c.id);
  
  if (categoryIds.length === 0) return [];
  
  const reviewIds = new Set<number>();
  Object.entries(data.reviewLocationCategoryMap || {}).forEach(([reviewId, cats]) => {
    if (cats.some(catId => categoryIds.includes(catId))) {
      reviewIds.add(parseInt(reviewId));
    }
  });
  
  return data.reviews.filter((r) => reviewIds.has(r.id));
}
