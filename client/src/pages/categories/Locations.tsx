import { Link } from "wouter";
import { MapPin, ArrowRight, Compass, Plane } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const regions = getRegions();

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, -rect.top + window.innerHeight / 2);
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const cardConfigs = [
    { 
      x: 'left-0 md:left-[5%]', 
      y: 'top-0',
      depth: 0.15,
      rotate: -3,
      size: 'w-full md:w-[55%]',
      zIndex: 30
    },
    { 
      x: 'right-0 md:right-[5%]', 
      y: 'top-[180px] md:top-[60px]',
      depth: 0.08,
      rotate: 2,
      size: 'w-full md:w-[50%]',
      zIndex: 20
    },
    { 
      x: 'left-0 md:left-[15%]', 
      y: 'top-[360px] md:top-[180px]',
      depth: 0.12,
      rotate: -1,
      size: 'w-full md:w-[52%]',
      zIndex: 10
    },
  ];

  return (
    <div className="min-h-screen" data-testid="locations-page">
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary" />
              <Plane className="w-4 h-4 text-primary" />
              <span className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground">
                Culinary Destinations
              </span>
              <Plane className="w-4 h-4 text-primary transform -scale-x-100" />
              <div className="w-8 h-px bg-primary" />
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-3">
              Explore Locations
            </h1>
            
            <p className="font-sans text-muted-foreground max-w-lg mx-auto">
              Floating through our curated dining destinations
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section 
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        style={{ minHeight: regions.length > 0 ? `${200 + regions.length * 200}px` : '400px' }}
      >
        {regions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No destinations have been added yet.</p>
          </div>
        ) : (
          <div className="relative h-[540px] md:h-[380px]" data-testid="locations-grid">
            {regions.map((region, index) => {
              const reviewCount = getRegionReviewCount(region.slug);
              const config = cardConfigs[index] || cardConfigs[0];
              
              const parallaxY = scrollY * config.depth;
              const floatOffset = Math.sin(Date.now() / 2000 + index) * 2;
              
              return (
                <div
                  key={region.slug}
                  className={`absolute ${config.x} ${config.y} ${config.size} transition-all duration-300`}
                  style={{
                    zIndex: config.zIndex,
                    transform: `translateY(${-parallaxY}px) rotate(${config.rotate}deg)`,
                  }}
                >
                  <AnimatedSection
                    animation="fade-in-up"
                    delay={index * 200}
                  >
                    <Link
                      href={`/location/${region.slug}`}
                      data-testid={`location-tile-${region.slug}`}
                    >
                      <div 
                        className="group relative rounded-xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-[1.03] hover:rotate-0"
                        style={{
                          transform: `translateY(${floatOffset}px)`,
                        }}
                      >
                        <div className="aspect-[16/10]">
                          <img
                            src={getRegionImage(region)}
                            alt={region.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 border-2 border-primary/60 rounded-xl" />
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-xl" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl" />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="font-mono text-[10px] text-white/50 tracking-wider">
                              {getCoordinates(region.slug)}
                            </span>
                          </div>
                          
                          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 transition-transform duration-300 group-hover:translate-x-1">
                            {region.name}
                          </h2>
                          
                          {region.description && (
                            <p className="font-sans text-xs md:text-sm text-white/60 mb-3 line-clamp-1">
                              {region.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3">
                            {reviewCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-sans">
                                {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                              </span>
                            )}
                            
                            <span className="inline-flex items-center font-sans text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                              Explore
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 text-muted-foreground">
            <Compass className="w-4 h-4 text-primary" />
            <span className="font-sans text-xs tracking-wider uppercase">More destinations coming soon</span>
            <Compass className="w-4 h-4 text-primary" />
          </div>
        </div>
      </section>
    </div>
  );
}
