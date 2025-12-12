import { Link } from "wouter";
import { MapPin, ArrowRight, Compass, Plane } from "lucide-react";
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
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-primary" />
              <Plane className="w-4 h-4 text-primary" />
              <span className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground">
                Culinary Destinations
              </span>
              <Plane className="w-4 h-4 text-primary transform -scale-x-100" />
              <div className="w-8 h-px bg-primary" />
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
              Explore Locations
            </h1>
            
            <p className="font-sans text-lg text-muted-foreground max-w-xl mx-auto">
              Journey through our curated dining experiences across the globe.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {regions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No destinations have been added yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for new culinary adventures!</p>
          </div>
        ) : (
          <div className="relative" data-testid="locations-grid">
            {regions.map((region, index) => {
              const reviewCount = getRegionReviewCount(region.slug);
              const offsets = [
                { x: 'md:ml-0', y: 'md:-mt-0', z: 'z-30', rotate: 'md:-rotate-2' },
                { x: 'md:ml-16 lg:ml-24', y: 'md:-mt-12', z: 'z-20', rotate: 'md:rotate-1' },
                { x: 'md:ml-8 lg:ml-12', y: 'md:-mt-16', z: 'z-10', rotate: 'md:-rotate-1' },
              ];
              const offset = offsets[index] || offsets[0];
              
              return (
                <AnimatedSection
                  key={region.slug}
                  animation="fade-in-up"
                  delay={index * 150}
                  className={`relative ${offset.z} ${offset.x} ${offset.y} ${index > 0 ? 'mt-6 md:mt-0' : ''}`}
                >
                  <Link
                    href={`/location/${region.slug}`}
                    data-testid={`location-tile-${region.slug}`}
                  >
                    <div className={`group relative rounded-lg overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 ${offset.rotate} hover:rotate-0 hover:scale-[1.02]`}>
                      <div className="aspect-[16/9] md:aspect-[2.5/1]">
                        <img
                          src={getRegionImage(region)}
                          alt={region.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 group-hover:from-black/85 transition-all duration-300" />
                      
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-lg transition-all duration-300" />
                      
                      <div className="absolute inset-0 flex items-center">
                        <div className="p-6 md:p-8 lg:p-10 max-w-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="font-mono text-xs text-white/50 tracking-wider">
                              {getCoordinates(region.slug)}
                            </span>
                          </div>
                          
                          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-2">
                            {region.name}
                          </h2>
                          
                          {region.description && (
                            <p className="font-sans text-sm text-white/70 mb-3 line-clamp-1 max-w-md">
                              {region.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4">
                            {reviewCount > 0 && (
                              <span className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-sans">
                                {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                              </span>
                            )}
                            
                            <span className="inline-flex items-center font-sans text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                              Explore
                              <ArrowRight className="w-4 h-4 ml-1" />
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
      </section>
    </div>
  );
}
