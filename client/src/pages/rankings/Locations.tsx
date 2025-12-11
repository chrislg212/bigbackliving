import { Link } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";
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

  return (
    <div className="min-h-screen" data-testid="locations-page">
      <section className="border-b border-primary/10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-48 md:h-auto md:min-h-[320px] order-1 md:order-2">
            <img 
              src={customImage || nycImage} 
              alt="Explore locations" 
              className="absolute inset-0 w-full h-full object-cover animate-fade-in-up"
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
                  <MapPin className="w-4 h-4" />
                  <span className="font-sans text-sm font-medium">Discover by Region</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
                  Locations
                </h1>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mb-6" />
                
                <p className="font-sans text-lg text-muted-foreground">
                  Explore our curated dining experiences across different regions. From the bustling streets of NYC to European adventures.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <AnimatedSection animation="fade-in-up" className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Browse by Location
            </h2>
          </div>
          <p className="font-sans text-muted-foreground">Click to explore restaurants in each region</p>
        </AnimatedSection>

        {regions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No locations have been created yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for location categories!</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="locations-grid"
          >
            {regions.map((region, index) => {
              const reviewCount = getRegionReviewCount(region.slug);
              return (
                <AnimatedSection
                  key={region.slug}
                  animation="scale-in"
                  delay={index * 100}
                >
                  <Link
                    href={`/location/${region.slug}`}
                    data-testid={`location-tile-${region.slug}`}
                  >
                    <div className="group relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                      <img
                        src={getRegionImage(region)}
                        alt={region.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-300 group-hover:from-black/85 group-hover:via-black/50" />
                      
                      <div className="absolute top-4 left-4">
                        {reviewCount > 0 && (
                          <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-sans">
                            {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                          </span>
                        )}
                      </div>
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-2">
                          {region.name}
                        </h3>
                        {region.description && (
                          <p className="font-sans text-sm text-white/70 mb-4 line-clamp-2">
                            {region.description}
                          </p>
                        )}
                        <span className="inline-flex items-center font-sans text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          Explore Region
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                        </span>
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
