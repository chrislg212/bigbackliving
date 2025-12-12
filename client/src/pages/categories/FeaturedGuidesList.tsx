import { Link } from "wouter";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
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
  const lists = getTopTenLists();

  const getListImage = (list: { slug: string; image?: string | null }) => {
    if (list.image) return list.image;
    return defaultListImages[list.slug] || premiumImage;
  };

  if (lists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="featured-guides-page">
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No featured guides have been created yet.</p>
          <p className="text-sm text-muted-foreground">Check back soon for curated lists!</p>
        </div>
      </div>
    );
  }

  const heroGuide = lists[0];
  const gridGuides = lists.slice(1);

  return (
    <div className="min-h-screen" data-testid="featured-guides-page">
      <AnimatedSection animation="fade-in-up">
        <Link href={`/featured-guides/${heroGuide.slug}`} data-testid="hero-card">
          <section className="relative h-[60vh] md:h-[70vh] overflow-hidden cursor-pointer group">
            <img
              src={getListImage(heroGuide)}
              alt={heroGuide.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground">
                <Award className="w-4 h-4" />
                <span className="font-sans text-sm font-medium uppercase tracking-wider">Editor's Pick</span>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-end">
              <div className="w-full max-w-7xl mx-auto px-6 md:px-10 pb-12 md:pb-16">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-px bg-primary" />
                    <span className="font-sans text-sm text-white/60 uppercase tracking-widest">Featured Guide</span>
                  </div>
                  
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-transform duration-300 group-hover:translate-x-2">
                    {heroGuide.name}
                  </h1>
                  
                  {heroGuide.description && (
                    <p className="font-sans text-lg md:text-xl text-white/80 mb-6 max-w-2xl">
                      {heroGuide.description}
                    </p>
                  )}
                  
                  <span className="inline-flex items-center gap-3 font-sans text-base font-medium text-primary transition-all duration-300 group-hover:gap-5">
                    Read the Full Guide
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Link>
      </AnimatedSection>

      {gridGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <AnimatedSection animation="fade-in-up" className="mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                More Guides
              </h2>
            </div>
          </AnimatedSection>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="top10-grid"
          >
            {gridGuides.map((guide, index) => (
              <AnimatedSection
                key={guide.slug}
                animation="fade-in-up"
                delay={100 + index * 80}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-300 group-hover:from-black/85" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1">
                        {guide.name}
                      </h3>
                      {guide.description && (
                        <p className="font-sans text-sm text-white/70 mb-4 line-clamp-2">
                          {guide.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        View Guide
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
