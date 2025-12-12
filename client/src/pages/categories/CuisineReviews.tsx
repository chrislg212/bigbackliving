import { useParams, Link } from "wouter";
import ReviewCard from "@/components/ReviewCard";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowLeft, Star, ArrowRight, Sparkles, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import internationalCuisineImage from "@assets/stock_images/international_cuisin_869e3bef.jpg";
import { getCuisineWithReviews } from "@/lib/staticData";

export default function CuisineReviews() {
  const { cuisine: cuisineSlug } = useParams<{ cuisine: string }>();

  const data = getCuisineWithReviews(cuisineSlug || "");

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">Cuisine Not Found</h1>
          <p className="text-muted-foreground mb-6">The cuisine you're looking for doesn't exist.</p>
          <Link href="/categories/cuisines">
            <Button variant="outline" data-testid="back-to-cuisines">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cuisines
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { cuisine, reviews } = data;
  const cuisineName = cuisine.name;

  return (
    <div className="min-h-screen" data-testid="cuisine-reviews-page">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cuisine.image || internationalCuisineImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute top-8 left-8 opacity-30 hidden md:block">
          <Utensils className="w-12 h-12 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Cuisine Collection
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
              {cuisineName}
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {cuisine.description || `Discover the best in authentic and innovative ${cuisineName.toLowerCase()} cooking`}
            </p>
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative mt-8 md:mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <Link href="/categories/cuisines">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-muted-foreground"
            data-testid="back-to-cuisines"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Cuisines
          </Button>
        </Link>

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
            <Link href="/categories/cuisines">
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
