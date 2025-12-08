import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Top10Lists() {
  // todo: remove mock functionality - fetch from API
  const lists = [
    { title: "Top 10 Date Night Spots", description: "Romantic restaurants perfect for a special evening", slug: "date-night" },
    { title: "Top 10 Brunch Spots", description: "The best places to start your weekend mornings", slug: "brunch" },
    { title: "Top 10 Hidden Gems", description: "Under-the-radar restaurants worth discovering", slug: "hidden-gems" },
    { title: "Top 10 Rooftop Dining", description: "Stunning views paired with exceptional food", slug: "rooftop" },
    { title: "Top 10 Tasting Menus", description: "Multi-course culinary experiences", slug: "tasting-menus" },
    { title: "Top 10 Late Night Eats", description: "Where to satisfy those midnight cravings", slug: "late-night" },
  ];

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
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="top10-grid"
        >
          {lists.map((list) => (
            <Card
              key={list.slug}
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {list.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground mb-4">
                  {list.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-sans font-medium text-primary">
                  View List
                  <ArrowRight className="w-3 h-3" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
