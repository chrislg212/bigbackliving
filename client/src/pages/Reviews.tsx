import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "@/components/ReviewCard";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { mockReviews } from "@/data/mockReviews";
import { Star, ArrowRight, Award, Loader2 } from "lucide-react";
import nycRestaurantsImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";
import type { Review as DBReview } from "@shared/schema";

export default function Reviews() {
  const { customImage } = usePageHeader("reviews");
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="reviews-page">
      <PageHeader
        title="My Reviews"
        subtitle="Thoughtful, honest reviews of the restaurants that shaped my palate. From quiet neighborhood discoveries to the city's most iconic dining rooms. A personal guide to exceptional food."
        backgroundImage={customImage || nycRestaurantsImage}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <AnimatedSection animation="fade-in-up" className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">My Picks</h2>
          </div>
          <p className="font-sans text-muted-foreground">My highest-rated restaurant experiences</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {reviews.slice(0, 3).map((review, index) => (
            <AnimatedSection key={review.id} animation="scale-in" delay={index * 100}>
              <Link href={`/review/${review.slug}`} data-testid={`hero-review-${review.id}`}>
                <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      {review.rating}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-sans">
                      {review.cuisine}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1 transition-transform duration-300 group-hover:translate-x-2">
                      {review.name}
                    </h3>
                    <p className="font-sans text-sm text-white/70 mb-3">
                      {review.location}
                    </p>
                    <span className="inline-flex items-center gap-1 font-sans text-sm font-medium text-primary group-hover:gap-2 transition-all duration-300">
                      Read Review
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in-up" className="mb-8">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
            All Reviews
          </h3>
        </AnimatedSection>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="all-reviews-grid"
        >
          {reviews.map((review, index) => (
            <AnimatedSection 
              key={review.id} 
              animation="fade-in-up" 
              delay={index * 75}
            >
              <ReviewCard review={review} />
            </AnimatedSection>
          ))}
        </div>

        {reviews.length === 0 && (
          <AnimatedSection animation="fade-in" className="text-center py-16">
            <p className="font-sans text-muted-foreground">
              No reviews yet. Check back soon!
            </p>
          </AnimatedSection>
        )}
      </section>
    </div>
  );
}
