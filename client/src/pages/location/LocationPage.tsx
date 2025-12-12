import { useState, useEffect } from "react";
import { MapPin, Navigation, Sparkles, ChevronLeft, ChevronRight, Star, Globe } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { usePageHeader } from "@/hooks/use-page-header";
import { getRegions, getLocationCategoriesByRegion, getReviewsByRegion } from "@/lib/staticData";

import nycBgImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";

interface LocationPageProps {
  regionSlug: string;
}

const regionConfig: Record<string, { 
  title: string; 
  subtitle: string; 
  accentText: string;
  description: string;
  pageSlug: string;
}> = {
  nyc: {
    title: "New York City",
    subtitle: "Eats",
    accentText: "Eats",
    description: "The city that never sleeps, and neither do we. Discover the best restaurants across all five boroughs.",
    pageSlug: "nyc-eats",
  },
  dmv: {
    title: "DMV Area",
    subtitle: "Eats",
    accentText: "Eats",
    description: "From Georgetown to Baltimore, explore the best dining experiences in DC, Maryland, and Virginia.",
    pageSlug: "dmv-eats",
  },
  europe: {
    title: "Europe",
    subtitle: "Dining",
    accentText: "Dining",
    description: "Culinary adventures across the European continent, from Paris bistros to Roman trattorias.",
    pageSlug: "europe-eats",
  },
};

export default function LocationPage({ regionSlug }: LocationPageProps) {
  const config = regionConfig[regionSlug] || regionConfig.nyc;
  const { customImage } = usePageHeader(config.pageSlug);
  
  const regions = getRegions();
  const region = regions.find(r => r.slug === regionSlug);
  const categories = getLocationCategoriesByRegion(region?.id || 0);
  
  const regionReviews = getReviewsByRegion(regionSlug);
  const hasRegionReviews = regionReviews.length > 0;

  const featuredReviews = hasRegionReviews ? regionReviews.slice(0, 6) : [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (featuredReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredReviews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredReviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length);
  };

  return (
    <div className="min-h-screen" data-testid={`location-page-${regionSlug}`}>
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || region?.image || nycBgImage})` }}
        />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute top-8 left-8 opacity-30 hidden md:block">
          <MapPin className="w-12 h-12 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-12 right-12 opacity-20 hidden md:block">
          <Navigation className="w-16 h-16 text-white" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Local Favorites
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-2">
              {config.title}
            </h1>
            <span className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-primary">
              {config.accentText}
            </span>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto mt-6">
              {config.description}
            </p>

            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {categories.map((category) => (
                  <Link key={category.id} href={`/location/${regionSlug}/${category.slug}`}>
                    <Badge
                      variant="outline"
                      className="px-3 py-1.5 text-sm font-sans cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <MapPin className="w-3 h-3 mr-1.5" />
                      <span className="font-medium">{category.name}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative mt-8 md:-mt-16 z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 md:pb-24">
        {featuredReviews.length > 0 && (
          <>
            <AnimatedSection animation="fade-in-up" className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                  Featured This Week
                </h2>
              </div>
              <p className="font-sans text-muted-foreground">Our top picks from {config.title}</p>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-up" delay={100} className="mb-20">
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 relative overflow-hidden rounded-md">
                    {featuredReviews.map((review, index) => (
                      <div
                        key={review.id}
                        className={`transition-opacity duration-500 ${
                          index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                        }`}
                      >
                        <Card className="overflow-hidden border-0 shadow-md group">
                          <div className="relative aspect-[16/10]">
                            <img
                              src={review.image || nycBgImage}
                              alt={review.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary/90 text-primary-foreground text-xs">
                                  Featured
                                </Badge>
                                <span className="text-white/70 text-sm font-sans">{review.cuisine}</span>
                              </div>
                              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                                {review.name}
                              </h3>
                              <div className="flex items-center gap-3 text-white/80 text-sm font-sans">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="font-semibold">{review.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                                  <span>{review.rating.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                        data-testid="carousel-prev"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                        data-testid="carousel-next"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {featuredReviews.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "bg-primary w-6"
                              : "bg-white/50 hover:bg-white/70"
                          }`}
                          onClick={(e) => { e.preventDefault(); setCurrentSlide(index); }}
                          data-testid={`carousel-dot-${index}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 relative z-20">
                    {featuredReviews.slice(0, 3).map((review, index) => (
                      <Card
                        key={review.id}
                        className={`overflow-hidden border-0 shadow-sm cursor-pointer group transition-all duration-300 hover:shadow-md ${
                          index === currentSlide ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        data-testid={`featured-thumb-${index}`}
                      >
                        <CardContent className="p-0">
                          <div className="flex gap-3 p-3">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                src={review.image || nycBgImage}
                                alt={review.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-sm font-bold text-foreground truncate mb-1">
                                {review.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-1">{review.cuisine}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span>{review.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </>
        )}

        {categories.length > 0 && (
          <>
            <AnimatedSection animation="fade-in-up" delay={200} className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Browse by Category
              </h2>
              <p className="font-sans text-muted-foreground">Explore {config.title} restaurants by category</p>
            </AnimatedSection>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16"
              data-testid="categories-grid"
            >
              {categories.map((category, index) => (
                <AnimatedSection 
                  key={category.id} 
                  animation="fade-in-up" 
                  delay={300 + index * 75}
                >
                  <Link href={`/location/${regionSlug}/${category.slug}`}>
                    <Card 
                      className="overflow-hidden border-0 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md bg-card"
                      data-testid={`category-card-${category.slug}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Globe className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <CardContent className="p-5">
                        <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          {category.name}
                        </h3>
                        
                        {category.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}

        {regionReviews.length > 0 && (
          <>
            <AnimatedSection animation="fade-in-up" delay={200} className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
                All {config.title} Reviews
              </h2>
              <p className="font-sans text-muted-foreground">Every spot worth visiting in {config.title}</p>
            </AnimatedSection>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              data-testid="reviews-grid"
            >
              {regionReviews.map((review, index) => (
                <AnimatedSection 
                  key={review.id} 
                  animation="fade-in-up" 
                  delay={300 + index * 75}
                >
                  <Link href={`/review/${review.slug}`}>
                    <Card 
                      className="overflow-hidden border-0 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md bg-card"
                      data-testid={`review-card-${review.slug}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={review.image || nycBgImage}
                          alt={review.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-sans">
                            {review.priceRange}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-sans text-primary font-medium uppercase tracking-wider">
                            {review.cuisine}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                            <span className="text-sm font-sans font-medium">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          {review.name}
                        </h3>
                        
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="font-semibold">{review.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}

        {regionReviews.length === 0 && categories.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No reviews in {config.title} yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for restaurant reviews!</p>
          </div>
        )}
      </section>
    </div>
  );
}
