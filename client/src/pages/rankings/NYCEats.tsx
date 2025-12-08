import ReviewCard from "@/components/ReviewCard";
import { mockReviews } from "@/data/mockReviews";

export default function NYCEats() {
  // todo: remove mock functionality - fetch from API
  const reviews = mockReviews;

  return (
    <div className="min-h-screen" data-testid="nyc-eats-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            NYC Eats
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            The best dining experiences across all five boroughs of New York City.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="nyc-eats-grid"
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}
