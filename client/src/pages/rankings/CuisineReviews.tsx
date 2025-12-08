import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "@/components/ReviewCard";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowLeft, Star, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import internationalCuisineImage from "@assets/stock_images/international_cuisin_869e3bef.jpg";
import type { Cuisine, Review } from "@shared/schema";

export default function CuisineReviews() {
  const { cuisine: cuisineSlug } = useParams<{ cuisine: string }>();

  const { data, isLoading, error } = useQuery<{ cuisine: Cuisine; reviews: Review[] }>({
    queryKey: ["/api/cuisines", cuisineSlug],
    enabled: !!cuisineSlug,
  });

  const cuisineName = data?.cuisine?.name || cuisineSlug || "Unknown";
  const reviews = data?.reviews || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.cuisine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">Cuisine Not Found</h1>
          <p className="text-muted-foreground mb-6">The cuisine you're looking for doesn't exist.</p>
          <Link href="/rankings/cuisines">
            <Button variant="outline" data-testid="back-to-cuisines">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cuisines
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="cuisine-reviews-page">
      <PageHeader
        title={`${cuisineName} Reviews`}
        subtitle={data.cuisine.description || "Discover the best in authentic and innovative cooking"}
        backgroundImage={data.cuisine.image || internationalCuisineImage}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {reviews.length > 0 ? (
          <>
            <AnimatedSection animation="fade-in-up" className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                  Top {cuisineName} Picks
                </h2>
              </div>
              <p className="font-sans text-muted-foreground">Our favorite {cuisineName.toLowerCase()} restaurants</p>
            </AnimatedSection>

            {reviews.length >= 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                {reviews.slice(0, 2).map((review, index) => (
                  <AnimatedSection key={review.id} animation="scale-in" delay={index * 100}>
                    <Link href={`/review/${review.slug}`} data-testid={`hero-review-${review.id}`}>
                      <div className="group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                        <img
                          src={review.image || internationalCuisineImage}
                          alt={review.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-sans font-medium">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {review.rating}
                          </span>
                          <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-sm font-sans">
                            {review.priceRange}
                          </span>
                        </div>
                        
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                          <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-2">
                            {review.name}
                          </h3>
                          <p className="font-sans text-sm text-white/70 mb-2">
                            {review.location}
                          </p>
                          <p className="font-sans text-sm text-white/80 line-clamp-2 mb-4 hidden sm:block">
                            {review.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
                            Read Full Review
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}

            {reviews.length > 2 && (
              <>
                <AnimatedSection animation="fade-in-up" className="mb-8">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
                    More {cuisineName} Reviews
                  </h3>
                </AnimatedSection>

                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  data-testid="cuisine-reviews-grid"
                >
                  {reviews.slice(2).map((review, index) => (
                    <AnimatedSection key={review.id} animation="fade-in-up" delay={index * 75}>
                      <ReviewCard review={review} />
                    </AnimatedSection>
                  ))}
                </div>
              </>
            )}

            {reviews.length === 1 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                data-testid="cuisine-reviews-grid"
              >
                {reviews.map((review, index) => (
                  <AnimatedSection key={review.id} animation="fade-in-up" delay={index * 75}>
                    <ReviewCard review={review} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-muted-foreground mb-6">
              No reviews have been added to this cuisine yet.
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
