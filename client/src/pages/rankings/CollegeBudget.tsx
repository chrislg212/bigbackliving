import ReviewCard from "@/components/ReviewCard";
import PageHeader from "@/components/PageHeader";
import { mockReviews } from "@/data/mockReviews";
import { Badge } from "@/components/ui/badge";

export default function CollegeBudget() {
  // todo: remove mock functionality - filter actual budget-friendly reviews
  const budgetReviews = mockReviews.filter(r => r.priceRange === "$$" || r.priceRange === "$");

  return (
    <div className="min-h-screen" data-testid="college-budget-page">
      <PageHeader
        title="College Budget Eats"
        subtitle="Exceptional food that won't break the bank"
        variant={2}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {budgetReviews.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="budget-reviews-grid"
          >
            {budgetReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-muted-foreground mb-4">
              No budget-friendly reviews yet. Check back soon!
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              We're always on the lookout for great food at affordable prices.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
