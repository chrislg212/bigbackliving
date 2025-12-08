import Hero from "@/components/Hero";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { mockReviews } from "@/data/mockReviews";

export default function Home() {
  // todo: remove mock functionality - fetch from API
  const recentReviews = mockReviews.slice(0, 6);

  return (
    <div data-testid="home-page">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2
            className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4"
            data-testid="section-title"
          >
            Latest Discoveries
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto">
            Our most recent dining adventures, from neighborhood gems to
            celebrated institutions.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="reviews-grid"
        >
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/reviews">
            <Button
              variant="outline"
              size="lg"
              className="font-sans uppercase tracking-wider"
              data-testid="view-all-reviews"
            >
              View All Reviews
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-card border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2
            className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4"
            data-testid="cta-title"
          >
            Have a Restaurant Recommendation?
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">
            We're always on the hunt for our next great meal. Share your
            favorite spots and we might feature them.
          </p>
          <a href="mailto:hello@thepalate.com">
            <Button
              variant="default"
              size="lg"
              className="font-sans uppercase tracking-wider"
              data-testid="contact-cta"
            >
              Get in Touch
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
