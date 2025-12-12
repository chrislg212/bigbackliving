import { Link } from "wouter";
import { ArrowRight, Award, Sparkles, BookOpen } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { getTopTenLists } from "@/lib/staticData";

import premiumImage from "@assets/stock_images/premium_award_winnin_fc3053ee.jpg";
import dateNightImage from "@assets/stock_images/romantic_candlelit_d_a4a26dad.jpg";
import brunchImage from "@assets/stock_images/brunch_table_with_eg_e4c89727.jpg";
import hiddenGemsImage from "@assets/stock_images/hidden_alley_restaur_cf270a9f.jpg";
import rooftopImage from "@assets/stock_images/rooftop_restaurant_c_50ae76eb.jpg";
import tastingMenuImage from "@assets/stock_images/fine_dining_tasting__c5be4924.jpg";
import lateNightImage from "@assets/stock_images/late_night_street_fo_3c908d48.jpg";

const defaultListImages: Record<string, string> = {
  "date-night": dateNightImage,
  "brunch": brunchImage,
  "hidden-gems": hiddenGemsImage,
  "rooftop": rooftopImage,
  "tasting-menus": tastingMenuImage,
  "late-night": lateNightImage,
};

export default function FeaturedGuidesList() {
  const { customImage } = usePageHeader("featured-guides");
  const lists = getTopTenLists();

  const getListImage = (list: { slug: string; image?: string | null }) => {
    if (list.image) return list.image;
    return defaultListImages[list.slug] || premiumImage;
  };

  return (
    <div className="min-h-screen" data-testid="featured-guides-page">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || premiumImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-background" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute top-8 left-8 opacity-30 hidden md:block">
          <BookOpen className="w-12 h-12 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-12 right-12 opacity-20 hidden md:block">
          <Award className="w-16 h-16 text-white" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Editorial Picks
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
              Featured Guides
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Curated collections of our favorite dining experiences, 
              handpicked for every occasion.
            </p>
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative -mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        {lists.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No featured guides have been created yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for curated lists!</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="top10-grid"
          >
            {lists.map((guide, index) => (
              <AnimatedSection
                key={guide.slug}
                animation="scale-in"
                delay={index * 100}
              >
                <Link
                  href={`/featured-guides/${guide.slug}`}
                  data-testid={`list-card-${guide.slug}`}
                >
                  <div className="group relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                    <img
                      src={getListImage(guide)}
                      alt={guide.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-300 group-hover:from-black/85 group-hover:via-black/50" />
                    
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground">
                        <Award className="w-3 h-3" />
                        <span className="font-sans text-xs font-medium">Guide</span>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-2">
                        {guide.name}
                      </h3>
                      {guide.description && (
                        <p className="font-sans text-sm text-white/70 mb-4 line-clamp-2">
                          {guide.description}
                        </p>
                      )}
                      <span className="inline-flex items-center font-sans text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        View Guide
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
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
