import { useParams, Link } from "wouter";
import ReviewCard from "@/components/ReviewCard";
import { mockReviews } from "@/data/mockReviews";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const cuisineNames: Record<string, string> = {
  italian: "Italian",
  japanese: "Japanese",
  steakhouse: "Steakhouse",
  french: "French",
  spanish: "Spanish",
  pizza: "Pizza",
};

export default function CuisineReviews() {
  const { cuisine } = useParams<{ cuisine: string }>();
  const cuisineName = cuisineNames[cuisine || ""] || cuisine || "Unknown";

  // todo: remove mock functionality - fetch from API filtered by cuisine
  const filteredReviews = mockReviews.filter((review) => {
    const reviewCuisine = review.cuisine.toLowerCase().replace(/\s+/g, "-");
    const normalizedCuisine = cuisine?.toLowerCase() || "";
    
    if (normalizedCuisine === "french") {
      return reviewCuisine.includes("french");
    }
    return reviewCuisine === normalizedCuisine;
  });

  return (
    <div className="min-h-screen" data-testid="cuisine-reviews-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Link href="/rankings/cuisines">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 text-muted-foreground"
              data-testid="back-to-cuisines"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Cuisines
            </Button>
          </Link>
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            {cuisineName} Reviews
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            {filteredReviews.length > 0
              ? `Explore our ${filteredReviews.length} ${cuisineName.toLowerCase()} restaurant ${filteredReviews.length === 1 ? "review" : "reviews"}.`
              : `No ${cuisineName.toLowerCase()} reviews yet. Check back soon!`}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {filteredReviews.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="cuisine-reviews-grid"
          >
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-muted-foreground mb-6">
              We haven't reviewed any {cuisineName.toLowerCase()} restaurants yet.
            </p>
            <Link href="/rankings/cuisines">
              <Button variant="outline" data-testid="browse-other-cuisines">
                Browse Other Cuisines
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
