import ReviewCard from "@/components/ReviewCard";
import { mockReviews } from "@/data/mockReviews";
import { Badge } from "@/components/ui/badge";

export default function CollegeBudget() {
  // todo: remove mock functionality - filter actual budget-friendly reviews
  const budgetReviews = mockReviews.filter(r => r.priceRange === "$$" || r.priceRange === "$");

  return (
    <div className="min-h-screen" data-testid="college-budget-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="font-sans text-xs uppercase tracking-wider">
              Under $20
            </Badge>
          </div>
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            College Budget Eats
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            Delicious meals that won't break the bank. Perfect for students and budget-conscious foodies.
          </p>
        </div>
      </section>

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
