import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, List, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import premiumImage from "@assets/stock_images/premium_award_winnin_fc3053ee.jpg";
import type { TopTenList } from "@shared/schema";

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

const listAccents: string[] = [
  "from-rose-600",
  "from-amber-600",
  "from-emerald-600",
  "from-sky-600",
  "from-violet-600",
  "from-indigo-600",
];

export default function Top10Lists() {
  const { customImage } = usePageHeader("top-10");
  
  const { data: lists = [], isLoading } = useQuery<TopTenList[]>({
    queryKey: ["/api/top-ten-lists"],
  });

  const getListImage = (list: TopTenList) => {
    if (list.image) return list.image;
    return defaultListImages[list.slug] || premiumImage;
  };

  const getListAccent = (index: number) => {
    return listAccents[index % listAccents.length];
  };

  const heroList = lists[0];
  const gridLists = lists.slice(1);

  return (
    <div className="min-h-screen" data-testid="top10-page">
      <section className="border-b border-primary/10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-48 md:h-auto md:min-h-[320px] order-1 md:order-2">
            <img 
              src={customImage || premiumImage} 
              alt="Premium dining" 
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
                  <List className="w-4 h-4" />
                  <span className="font-sans text-sm font-medium">Editorial Picks</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">Featured Guides</h1>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mb-6" />
                
                <p className="font-sans text-lg text-muted-foreground">Top 10 rankings of specific </p>
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
        ) : lists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured lists have been created yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for curated lists!</p>
          </div>
        ) : (
          <>
            <AnimatedSection animation="fade-in-up" className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">Top Featured Guide</h2>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-in" delay={100}>
              <Link href={`/top-10/${heroList.slug}`} data-testid="hero-card">
                <div className="group relative w-full aspect-[21/9] md:aspect-[3/1] rounded-lg overflow-hidden cursor-pointer mb-12 md:mb-16 card-hover-lift gold-glow-hover">
                  <img
                    src={getListImage(heroList)}
                    alt={heroList.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${getListAccent(0)}/80 via-black/60 to-black/30`} />
                  
                  <div className="absolute top-6 left-6 md:top-8 md:left-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
                      <Award className="w-3 h-3" />
                      <span className="font-sans text-xs font-medium uppercase tracking-wider">Featured</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 max-w-xl transition-transform duration-300 group-hover:translate-x-2">
                      {heroList.name}
                    </h2>
                    {heroList.description && (
                      <p className="font-sans text-sm md:text-base text-white/80 mb-6 max-w-lg hidden sm:block">
                        {heroList.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 font-sans text-sm md:text-base font-medium text-primary group-hover:gap-4 transition-all duration-300">
                      View Complete List
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 arrow-hover-right" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {gridLists.length > 0 && (
              <>
                <AnimatedSection animation="fade-in-up" delay={200} className="mb-8">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
                    More Guides to Explore
                  </h3>
                </AnimatedSection>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  data-testid="top10-grid"
                >
                  {gridLists.map((list, index) => (
                    <AnimatedSection
                      key={list.slug}
                      animation="fade-in-up"
                      delay={300 + index * 100}
                    >
                      <Link
                        href={`/top-10/${list.slug}`}
                        data-testid={`list-card-${list.slug}`}
                      >
                        <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer shadow-sm card-hover-lift">
                          <img
                            src={getListImage(list)}
                            alt={list.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${getListAccent(index + 1)}/70 via-black/50 to-black/20 transition-all duration-300 group-hover:via-black/60`} />
                          
                          <div className="absolute top-4 left-4">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                              <span className="font-serif text-sm font-bold text-white">10</span>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1">
                              {list.name}
                            </h3>
                            {list.description && (
                              <p className="font-sans text-sm text-white/70 mb-4 line-clamp-2">
                                {list.description}
                              </p>
                            )}
                            <span className="inline-flex items-center gap-1 font-sans text-sm font-medium text-primary group-hover:gap-2 transition-all duration-300">
                              View List
                              <ArrowRight className="w-4 h-4 arrow-hover-right" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
