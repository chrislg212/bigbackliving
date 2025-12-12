import { Link } from "wouter";
import { Globe, Utensils, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import worldCuisineImage from "@assets/stock_images/world_cuisine_restau_2be4b246.jpg";
import { getCuisines } from "@/lib/staticData";

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
  
  const cuisines = getCuisines();

  const getCuisineImage = (cuisine: { slug: string; image?: string | null }) => {
    if (cuisine.image) return cuisine.image;
    const key = cuisine.slug.toLowerCase();
    return defaultCuisineImages[key] || italianImage;
  };

  return (
    <div className="min-h-screen" data-testid="cuisines-page">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || worldCuisineImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-background" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute top-8 left-8 opacity-30 hidden md:block">
          <Globe className="w-12 h-12 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-12 right-12 opacity-20 hidden md:block">
          <Utensils className="w-16 h-16 text-white" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                A World of Flavors
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
              Cuisines
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Explore the world through exceptional cooking. Each cuisine tells a story of tradition, innovation, and passion.
            </p>
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative mt-8 md:-mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {cuisines.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No cuisines have been created yet.</p>
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
      </section>
    </div>
  );
}
