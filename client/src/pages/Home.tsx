import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageHeader } from "@/hooks/use-page-header";
import { mockReviews } from "@/data/mockReviews";
import { Loader2 } from "lucide-react";
import type { Review as DBReview } from "@shared/schema";

export default function Home() {
  const { customImage } = usePageHeader("home");
  const { data: dbReviews = [], isLoading } = useQuery<DBReview[]>({
    queryKey: ["/api/reviews"],
  });

  const reviews = dbReviews.length > 0 
    ? dbReviews.map(r => ({
        id: String(r.id),
        slug: r.slug,
        name: r.name,
        cuisine: r.cuisine,
        location: r.location,
        rating: r.rating,
        excerpt: r.excerpt,
        image: r.image || "",
        priceRange: r.priceRange,
      }))
    : mockReviews;

  const recentReviews = reviews.slice(0, 6);

  return (
    <div data-testid="home-page">
      <Hero customImage={customImage} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2
            className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4"
            data-testid="section-title"
          >
            Latest Discoveries
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto">My most recent dining adventures, from neighborhood gems to celebrated institutions.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="reviews-grid"
          >
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/reviews">
            <Button
              variant="outline"
              size="lg"
              className="font-sans uppercase tracking-wider"
              data-testid="view-all-reviews"
            >
              View All Reviews
            </Button>
          </Link>
        </div>
      </section>
      <section className="bg-card border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2
            className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4"
            data-testid="cta-title"
          >
            Have a Restaurant Recommendation?
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">I'm always on the hunt for my next great meal. Share your favorite spots and I might feature them!</p>
          <a href="mailto:bigbackliving@gmail.com">
            <Button
              variant="default"
              size="lg"
              className="font-sans uppercase tracking-wider"
              data-testid="contact-cta"
            >
              Get in Touch
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
