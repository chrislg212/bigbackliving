import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { mockReviews } from "@/data/mockReviews";

export default function Cuisines() {
  // todo: remove mock functionality - derive from real data
  const cuisineTypes = [
    { name: "Italian", count: 12, slug: "italian" },
    { name: "Japanese", count: 8, slug: "japanese" },
    { name: "Steakhouse", count: 6, slug: "steakhouse" },
    { name: "French", count: 5, slug: "french" },
    { name: "Spanish", count: 4, slug: "spanish" },
    { name: "Pizza", count: 7, slug: "pizza" },
  ];

  return (
    <div className="min-h-screen" data-testid="cuisines-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            Cuisines
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            Explore our reviews organized by cuisine type. Find your next favorite dish.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="cuisines-grid"
        >
          {cuisineTypes.map((cuisine) => (
            <Card
              key={cuisine.slug}
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <CardContent className="p-6">
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  {cuisine.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  {cuisine.count} reviews
                </p>
                <span className="inline-block mt-4 text-sm font-sans font-medium text-primary hover:underline">
                  View All
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
