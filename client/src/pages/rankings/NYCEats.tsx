import ReviewCard from "@/components/ReviewCard";
import PageHeader from "@/components/PageHeader";
import { mockReviews } from "@/data/mockReviews";

export default function NYCEats() {
  // todo: remove mock functionality - fetch from API
  const reviews = mockReviews;

  return (
    <div className="min-h-screen" data-testid="nyc-eats-page">
      <PageHeader
        title="NYC Eats"
        subtitle="The finest dining across all five boroughs"
        variant={2}
      />

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
