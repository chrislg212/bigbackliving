import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Globe, Utensils, Star, ArrowRight, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { usePageHeader } from "@/hooks/use-page-header";
import worldCuisineImage from "@assets/stock_images/world_cuisine_restau_2be4b246.jpg";
import type { Cuisine, Review } from "@shared/schema";

import italianImage from "@assets/stock_images/italian_pasta_dish_w_817916d1.jpg";
import japaneseImage from "@assets/stock_images/japanese_sushi_platt_365bff1f.jpg";
import steakhouseImage from "@assets/stock_images/grilled_steak_with_h_f006fe70.jpg";
import frenchImage from "@assets/stock_images/french_cuisine_coq_a_8ef97274.jpg";
import spanishImage from "@assets/stock_images/spanish_tapas_paella_58b31556.jpg";
import pizzaImage from "@assets/stock_images/artisan_pizza_with_f_561fe258.jpg";

const defaultCuisineImages: Record<string, string> = {
  italian: italianImage,
  japanese: japaneseImage,
  steakhouse: steakhouseImage,
  french: frenchImage,
  spanish: spanishImage,
  pizza: pizzaImage,
};

export default function Cuisines() {
  const { customImage } = usePageHeader("cuisines");
  
  const { data: cuisines = [], isLoading: cuisinesLoading } = useQuery<Cuisine[]>({
    queryKey: ["/api/cuisines"],
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const isLoading = cuisinesLoading || reviewsLoading;

  const getCuisineImage = (cuisine: Cuisine) => {
    if (cuisine.image) return cuisine.image;
    const key = cuisine.slug.toLowerCase();
    return defaultCuisineImages[key] || italianImage;
  };

  return (
    <div className="min-h-screen" data-testid="cuisines-page">
      <section className="border-b border-primary/10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-48 md:h-auto md:min-h-[320px] order-1 md:order-2">
            <img 
              src={customImage || worldCuisineImage} 
              alt="World cuisines" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
          </div>
          
          <div className="bg-background relative order-2 md:order-1">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            </div>
            
            <div className="relative max-w-xl mx-auto md:ml-auto md:mr-0 px-6 lg:px-12 py-16 md:py-24">
              <AnimatedSection animation="fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                  <Globe className="w-4 h-4" />
                  <span className="font-sans text-sm font-medium">A World of Flavors</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
                  Cuisines
                </h1>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mb-6" />
                
                <p className="font-sans text-lg text-muted-foreground">
                  Explore the world through exceptional cooking. Each cuisine tells a story of tradition, innovation, and passion.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {reviews.length > 0 && (
              <>
                <AnimatedSection animation="fade-in-up" className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                      Featured Reviews
                    </h2>
                  </div>
                  <p className="font-sans text-muted-foreground">Our top picks across all cuisines</p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                  {reviews.slice(0, 3).map((review, index) => (
                    <AnimatedSection key={review.id} animation="fade-in-up" delay={index * 100}>
                      <Link href={`/review/${review.slug}`} data-testid={`hero-review-${review.id}`}>
                        <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                          <img
                            src={review.image || italianImage}
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
              </>
            )}

            <AnimatedSection animation="fade-in-up" className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Utensils className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                  Browse by Cuisine
                </h2>
              </div>
              <p className="font-sans text-muted-foreground">Click to explore restaurants by culinary tradition</p>
            </AnimatedSection>

            {cuisines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No cuisines have been created yet.</p>
                <p className="text-sm text-muted-foreground">Check back soon for cuisine categories!</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                data-testid="cuisines-grid"
              >
                {cuisines.map((cuisine, index) => (
                  <AnimatedSection
                    key={cuisine.slug}
                    animation="scale-in"
                    delay={index * 100}
                  >
                    <Link
                      href={`/cuisines/${cuisine.slug}`}
                      data-testid={`cuisine-tile-${cuisine.slug}`}
                    >
                      <div className="group relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                        <img
                          src={getCuisineImage(cuisine)}
                          alt={cuisine.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-300 group-hover:from-black/85 group-hover:via-black/50" />
                        
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-2">
                            {cuisine.name}
                          </h3>
                          {cuisine.description && (
                            <p className="font-sans text-sm text-white/70 mb-4 line-clamp-2">
                              {cuisine.description}
                            </p>
                          )}
                          <span className="inline-flex items-center font-sans text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            Explore Cuisine
                            <svg
                              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
