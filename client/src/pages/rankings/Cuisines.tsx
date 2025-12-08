import { Link } from "wouter";
import PageHeader from "@/components/PageHeader";
import { mockReviews } from "@/data/mockReviews";

import italianImage from "@assets/stock_images/italian_pasta_dish_w_817916d1.jpg";
import japaneseImage from "@assets/stock_images/japanese_sushi_platt_365bff1f.jpg";
import steakhouseImage from "@assets/stock_images/grilled_steak_with_h_f006fe70.jpg";
import frenchImage from "@assets/stock_images/french_cuisine_coq_a_8ef97274.jpg";
import spanishImage from "@assets/stock_images/spanish_tapas_paella_58b31556.jpg";
import pizzaImage from "@assets/stock_images/artisan_pizza_with_f_561fe258.jpg";

interface CuisineType {
  name: string;
  slug: string;
  image: string;
}

export default function Cuisines() {
  // todo: remove mock functionality - derive from real data
  const cuisineTypes: CuisineType[] = [
    { name: "Italian", slug: "italian", image: italianImage },
    { name: "Japanese", slug: "japanese", image: japaneseImage },
    { name: "Steakhouse", slug: "steakhouse", image: steakhouseImage },
    { name: "French", slug: "french", image: frenchImage },
    { name: "Spanish", slug: "spanish", image: spanishImage },
    { name: "Pizza", slug: "pizza", image: pizzaImage },
  ];

  const getCuisineCount = (cuisineName: string) => {
    return mockReviews.filter((review) => {
      const reviewCuisine = review.cuisine.toLowerCase();
      const searchCuisine = cuisineName.toLowerCase();
      if (searchCuisine === "french") {
        return reviewCuisine.includes("french");
      }
      return reviewCuisine === searchCuisine;
    }).length;
  };

  return (
    <div className="min-h-screen" data-testid="cuisines-page">
      <PageHeader
        title="Cuisines"
        subtitle="Explore the world through exceptional cooking"
        variant={3}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="cuisines-grid"
        >
          {cuisineTypes.map((cuisine) => {
            const count = getCuisineCount(cuisine.name);
            return (
              <Link
                key={cuisine.slug}
                href={`/cuisines/${cuisine.slug}`}
                data-testid={`cuisine-tile-${cuisine.slug}`}
              >
                <div className="group relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/50" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-1">
                      {cuisine.name}
                    </h3>
                    <p className="font-sans text-sm text-white/80 mb-4">
                      {count} {count === 1 ? "review" : "reviews"}
                    </p>
                    <span className="inline-flex items-center font-sans text-sm font-medium text-primary group-hover:text-primary/90 transition-colors">
                      View All
                      <svg
                        className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
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
            );
          })}
        </div>
      </section>
    </div>
  );
}
