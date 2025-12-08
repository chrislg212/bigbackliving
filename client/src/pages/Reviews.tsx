import ReviewCard from "@/components/ReviewCard";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { mockReviews } from "@/data/mockReviews";
import nycRestaurantsImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";

export default function Reviews() {
  const reviews = mockReviews;

  return (
    <div className="min-h-screen" data-testid="reviews-page">
      <PageHeader
        title="All Reviews"
        subtitle="Thoughtfully curated restaurant reviews across New York City"
        backgroundImage={nycRestaurantsImage}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="all-reviews-grid"
        >
          {reviews.map((review, index) => (
            <AnimatedSection 
              key={review.id} 
              animation="fade-in-up" 
              delay={index * 75}
            >
              <ReviewCard review={review} />
            </AnimatedSection>
          ))}
        </div>

        {reviews.length === 0 && (
          <AnimatedSection animation="fade-in" className="text-center py-16">
            <p className="font-sans text-muted-foreground">
              No reviews yet. Check back soon!
            </p>
          </AnimatedSection>
        )}
      </section>
    </div>
  );
}
