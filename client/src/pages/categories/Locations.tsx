import { Link } from "wouter";
import { MapPin, ArrowRight, Compass, Globe, Plane } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { getRegions, getReviewsByRegion } from "@/lib/staticData";

import nycImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";
import worldCuisineImage from "@assets/stock_images/world_cuisine_restau_2be4b246.jpg";
import internationalImage from "@assets/stock_images/international_cuisin_869e3bef.jpg";

const defaultRegionImages: Record<string, string> = {
  nyc: nycImage,
  dmv: worldCuisineImage,
  europe: internationalImage,
};

const regionCoordinates: Record<string, string> = {
  nyc: "40.7128° N, 74.0060° W",
  dmv: "38.9072° N, 77.0369° W",
  europe: "48.8566° N, 2.3522° E",
};

export default function Locations() {
  const { customImage } = usePageHeader("locations");
  
  const regions = getRegions();

  const getRegionImage = (region: { slug: string; image?: string | null }) => {
    if (region.image) return region.image;
    const key = region.slug.toLowerCase();
    return defaultRegionImages[key] || nycImage;
  };

  const getRegionReviewCount = (regionSlug: string) => {
    return getReviewsByRegion(regionSlug).length;
  };

  const getCoordinates = (slug: string) => {
    return regionCoordinates[slug.toLowerCase()] || "";
  };

  return (
    <div className="min-h-screen" data-testid="locations-page">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || nycImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute top-8 left-8 opacity-30 hidden md:block">
          <Compass className="w-12 h-12 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-12 right-12 opacity-20 hidden md:block">
          <Globe className="w-16 h-16 text-white" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Plane className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Culinary Destinations
              </span>
              <Plane className="w-5 h-5 text-primary transform -scale-x-100" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
              Explore the World
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Journey through our curated dining experiences across the globe. 
              Each destination tells a unique culinary story.
            </p>
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative mt-8 md:mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {regions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No destinations have been added yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for new culinary adventures!</p>
          </div>
        ) : (
          <div className="space-y-8" data-testid="locations-grid">
            {regions.map((region, index) => {
              const reviewCount = getRegionReviewCount(region.slug);
              const isEven = index % 2 === 0;
              
              return (
                <AnimatedSection
                  key={region.slug}
                  animation="fade-in-up"
                  delay={index * 150}
                >
                  <Link
                    href={`/location/${region.slug}`}
                    data-testid={`location-tile-${region.slug}`}
                  >
                    <div className="group relative rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover aspect-[16/9] md:aspect-[4/1]">
                      <img
                        src={getRegionImage(region)}
                        alt={region.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        isEven 
                          ? 'bg-gradient-to-r from-black/85 via-black/60 to-black/20 group-hover:from-black/90'
                          : 'bg-gradient-to-l from-black/85 via-black/60 to-black/20 group-hover:from-black/90'
                      }`} />
                      
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                      </div>
                      
                      <div className={`absolute inset-0 flex items-center ${
                        isEven ? 'justify-start' : 'justify-end'
                      }`}>
                        <div className={`p-8 md:p-12 lg:p-16 max-w-2xl ${
                          isEven ? 'text-left' : 'text-right'
                        }`}>
                          <div className={`flex items-center gap-2 mb-3 ${
                            isEven ? '' : 'justify-end'
                          }`}>
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-mono text-xs text-white/50 tracking-wider">
                              {getCoordinates(region.slug)}
                            </span>
                          </div>
                          
                          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 transition-transform duration-300 group-hover:translate-x-2">
                            {region.name}
                          </h2>
                          
                          {region.description && (
                            <p className="font-sans text-base md:text-lg text-white/70 mb-4 line-clamp-2 max-w-md">
                              {region.description}
                            </p>
                          )}
                          
                          <div className={`flex items-center gap-4 ${
                            isEven ? '' : 'justify-end'
                          }`}>
                            {reviewCount > 0 && (
                              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-sans border border-white/10">
                                {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                              </span>
                            )}
                            
                            <span className={`inline-flex items-center font-sans text-sm font-medium text-primary transition-all duration-300 ${
                              isEven ? 'translate-x-0 group-hover:translate-x-2' : '-translate-x-0 group-hover:-translate-x-2'
                            }`}>
                              {isEven ? (
                                <>
                                  Explore Destination
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
                                  Explore Destination
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        )}
        
        <AnimatedSection animation="fade-in-up" delay={400}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 text-muted-foreground">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-border" />
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-wider uppercase">More destinations coming soon</span>
              <Compass className="w-5 h-5 text-primary" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-border" />
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
