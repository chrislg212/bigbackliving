import { Link } from "wouter";
import { ArrowRight, Award, List } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import premiumImage from "@assets/stock_images/premium_award_winnin_fc3053ee.jpg";

import dateNightImage from "@assets/stock_images/romantic_candlelit_d_a4a26dad.jpg";
import brunchImage from "@assets/stock_images/brunch_table_with_eg_e4c89727.jpg";
import hiddenGemsImage from "@assets/stock_images/hidden_alley_restaur_cf270a9f.jpg";
import rooftopImage from "@assets/stock_images/rooftop_restaurant_c_50ae76eb.jpg";
import tastingMenuImage from "@assets/stock_images/fine_dining_tasting__c5be4924.jpg";
import lateNightImage from "@assets/stock_images/late_night_street_fo_3c908d48.jpg";

interface TopList {
  title: string;
  description: string;
  slug: string;
  image: string;
  accent: string;
}

export default function Top10Lists() {
  const lists: TopList[] = [
    {
      title: "Top 10 Date Night Spots",
      description: "Romantic restaurants perfect for a special evening with someone you love",
      slug: "date-night",
      image: dateNightImage,
      accent: "from-rose-600",
    },
    {
      title: "Top 10 Brunch Spots",
      description: "The best places to start your weekend mornings in style",
      slug: "brunch",
      image: brunchImage,
      accent: "from-amber-600",
    },
    {
      title: "Top 10 Hidden Gems",
      description: "Under-the-radar restaurants worth discovering",
      slug: "hidden-gems",
      image: hiddenGemsImage,
      accent: "from-emerald-600",
    },
    {
      title: "Top 10 Rooftop Dining",
      description: "Stunning views paired with exceptional food",
      slug: "rooftop",
      image: rooftopImage,
      accent: "from-sky-600",
    },
    {
      title: "Top 10 Tasting Menus",
      description: "Multi-course culinary experiences that tell a story",
      slug: "tasting-menus",
      image: tastingMenuImage,
      accent: "from-violet-600",
    },
    {
      title: "Top 10 Late Night Eats",
      description: "Where to satisfy those midnight cravings",
      slug: "late-night",
      image: lateNightImage,
      accent: "from-indigo-600",
    },
  ];

  const heroLists = lists.slice(0, 2);
  const gridLists = lists.slice(2);

  return (
    <div className="min-h-screen" data-testid="top10-page">
      <section className="relative bg-card border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${premiumImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px) saturate(0.5) brightness(0.9)",
          opacity: 0.3,
        }} />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <AnimatedSection animation="fade-in-up" className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <List className="w-4 h-4" />
              <span className="font-sans text-sm font-medium">Editorial Picks</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl font-semibold text-foreground mb-4">
              Top 10 Lists
            </h1>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            
            <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated collections to guide your next great meal. Each list is carefully crafted by our editorial team.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <AnimatedSection animation="fade-in-up" className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Editor's Picks
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {heroLists.map((heroList, index) => (
            <AnimatedSection key={heroList.slug} animation="scale-in" delay={100 + index * 100}>
              <Link href={`/top-10/${heroList.slug}`} data-testid={`hero-card-${index}`}>
                <div className="group relative w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                  <img
                    src={heroList.image}
                    alt={heroList.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${heroList.accent}/80 via-black/60 to-black/30`} />
                  
                  <div className="absolute top-6 left-6 md:top-8 md:left-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
                      <Award className="w-3 h-3" />
                      <span className="font-sans text-xs font-medium uppercase tracking-wider">Featured</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 max-w-lg transition-transform duration-300 group-hover:translate-x-2">
                      {heroList.title}
                    </h2>
                    <p className="font-sans text-sm md:text-base text-white/80 mb-4 max-w-md hidden sm:block line-clamp-2">
                      {heroList.description}
                    </p>
                    <span className="inline-flex items-center gap-2 font-sans text-sm md:text-base font-medium text-primary group-hover:gap-4 transition-all duration-300">
                      View Complete List
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 arrow-hover-right" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in-up" delay={200} className="mb-8">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
            More Lists to Explore
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
                    src={list.image}
                    alt={list.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${list.accent}/70 via-black/50 to-black/20 transition-all duration-300 group-hover:via-black/60`} />
                  
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="font-serif text-sm font-bold text-white">10</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1">
                      {list.title}
                    </h3>
                    <p className="font-sans text-sm text-white/70 mb-4 line-clamp-2">
                      {list.description}
                    </p>
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
      </section>
    </div>
  );
}
