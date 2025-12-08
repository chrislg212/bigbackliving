import { useState, useEffect } from "react";
import { MapPin, Navigation, Sparkles, ChevronLeft, ChevronRight, Star } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import AnimatedSection from "@/components/AnimatedSection";
import { mockReviews } from "@/data/mockReviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import nycFoodBgImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";

const neighborhoods = [
  "Manhattan",
  "Brooklyn", 
  "Queens",
  "Bronx",
  "Staten Island",
];

export default function NYCEats() {
  const reviews = mockReviews;
  const featuredReviews = reviews.slice(0, 6);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
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
    <div className="min-h-screen" data-testid="nyc-eats-page">
      <section className="border-b border-primary/10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-56 md:h-auto md:min-h-[400px] order-1 md:order-2">
            <img 
              src={nycFoodBgImage} 
              alt="NYC food scene" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
          </div>
          
          <div className="bg-background relative order-2 md:order-1">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
            </div>
            
            <div className="relative max-w-xl mx-auto md:ml-auto md:mr-0 px-6 lg:px-12 py-12 md:py-20">
              <AnimatedSection animation="fade-in-up">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                  New York City
                  <br />
                  <span className="text-primary">Eats</span>
                </h1>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mb-6" />
                
                <p className="font-sans text-base md:text-lg text-muted-foreground mb-8">
                  The city that never sleeps, and neither do we. Discover the best restaurants across all five boroughs.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {neighborhoods.map((hood, index) => (
                    <Badge
                      key={hood}
                      variant="outline"
                      className={`px-3 py-1.5 text-sm font-sans cursor-pointer opacity-0 animate-fade-in-up stagger-${index + 1}`}
                    >
                      <MapPin className="w-3 h-3 mr-1.5" />
                      <span className="font-medium">{hood}</span>
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="transition-all duration-300"
                  data-testid="explore-boroughs-btn"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Explore the Five Boroughs
                </Button>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <AnimatedSection animation="fade-in-up" className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Featured This Week
            </h2>
          </div>
          <p className="font-sans text-muted-foreground">Our top picks from around the city</p>
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
                          src={review.image}
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
                            src={review.image}
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

        <AnimatedSection animation="fade-in-up" delay={200} className="mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
            All NYC Reviews
          </h2>
          <p className="font-sans text-muted-foreground">Every corner, every cuisine, every craving</p>
        </AnimatedSection>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          data-testid="nyc-eats-grid"
        >
          {reviews.slice(1).map((review, index) => (
            <AnimatedSection 
              key={review.id} 
              animation="fade-in-up" 
              delay={300 + index * 75}
            >
              <Link href={`/review/${review.slug}`}>
                <Card 
                  className={`overflow-hidden border-0 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    index % 3 === 0 
                      ? "shadow-md bg-card" 
                      : index % 3 === 1 
                        ? "shadow-sm bg-card ring-1 ring-primary/10" 
                        : "shadow-md bg-gradient-to-br from-card to-card/80"
                  }`}
                  data-testid={`review-card-${review.slug}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={review.image}
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
      </section>
    </div>
  );
}
