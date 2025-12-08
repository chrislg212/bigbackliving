import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

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
}

export default function Top10Lists() {
  // todo: remove mock functionality - fetch from API
  const lists: TopList[] = [
    {
      title: "Top 10 Date Night Spots",
      description: "Romantic restaurants perfect for a special evening with someone you love",
      slug: "date-night",
      image: dateNightImage,
    },
    {
      title: "Top 10 Brunch Spots",
      description: "The best places to start your weekend mornings in style",
      slug: "brunch",
      image: brunchImage,
    },
    {
      title: "Top 10 Hidden Gems",
      description: "Under-the-radar restaurants worth discovering",
      slug: "hidden-gems",
      image: hiddenGemsImage,
    },
    {
      title: "Top 10 Rooftop Dining",
      description: "Stunning views paired with exceptional food",
      slug: "rooftop",
      image: rooftopImage,
    },
    {
      title: "Top 10 Tasting Menus",
      description: "Multi-course culinary experiences that tell a story",
      slug: "tasting-menus",
      image: tastingMenuImage,
    },
    {
      title: "Top 10 Late Night Eats",
      description: "Where to satisfy those midnight cravings",
      slug: "late-night",
      image: lateNightImage,
    },
  ];

  const heroList = lists[0];
  const gridLists = lists.slice(1);

  return (
    <div className="min-h-screen" data-testid="top10-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            Top 10 Lists
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            Curated lists to help you find exactly what you're looking for.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link href={`/top-10/${heroList.slug}`} data-testid="hero-card">
          <div className="group relative w-full aspect-[21/9] md:aspect-[3/1] rounded-md overflow-hidden cursor-pointer mb-8 md:mb-12">
            <img
              src={heroList.image}
              alt={heroList.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16">
              <span className="font-sans text-xs md:text-sm font-medium text-primary uppercase tracking-wider mb-3">
                Featured List
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 md:mb-4 max-w-xl">
                {heroList.title}
              </h2>
              <p className="font-sans text-sm md:text-base text-white/80 mb-6 max-w-lg hidden sm:block">
                {heroList.description}
              </p>
              <span className="inline-flex items-center gap-2 font-sans text-sm md:text-base font-medium text-primary group-hover:gap-3 transition-all duration-300">
                View List
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </div>
          </div>
        </Link>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="top10-grid"
        >
          {gridLists.map((list) => (
            <Link
              key={list.slug}
              href={`/top-10/${list.slug}`}
              data-testid={`list-card-${list.slug}`}
            >
              <div className="group relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300">
                <img
                  src={list.image}
                  alt={list.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/50" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-2">
                    {list.title}
                  </h3>
                  <p className="font-sans text-sm text-white/75 mb-4 line-clamp-2">
                    {list.description}
                  </p>
                  <span className="inline-flex items-center gap-1 font-sans text-sm font-medium text-primary group-hover:gap-2 transition-all duration-300">
                    View List
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
