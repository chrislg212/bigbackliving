import { useState } from "react";
import Hero from "@/components/Hero";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Quote, BookOpen } from "lucide-react";
import { usePageHeader } from "@/hooks/use-page-header";
import { getReviews, getTopTenLists } from "@/lib/staticData";
import ContactFormModal from "@/components/ContactFormModal";

export default function Home() {
  const { customImage } = usePageHeader("home");
  const reviews = getReviews();
  const recentReviews = reviews.slice(0, 3);
  const featuredGuides = getTopTenLists().slice(0, 3);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div data-testid="home-page">
      <Hero customImage={customImage} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:pt-20 md:pb-10">
        <div className="relative text-center" data-testid="personal-quote">
          <Quote className="w-10 h-10 text-primary/30 mx-auto mb-4" />
          <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground italic leading-relaxed">
            "Food is not just fuel, it's an experience. Every meal tells a story, and I'm here to share those stories with you."
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-primary/40" />
            <span className="font-sans text-sm text-muted-foreground tracking-wider uppercase">Bigbackliving</span>
            <div className="w-8 h-px bg-primary/40" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2
            className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4"
            data-testid="section-title"
          >
            Latest Discoveries
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto">My most recent dining adventures, from neighborhood gems to celebrated institutions.</p>
        </div>

        {recentReviews.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-testid="reviews-grid"
          >
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-sans text-muted-foreground mb-4">No reviews yet. Check back soon!</p>
          </div>
        )}

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

      {featuredGuides.length > 0 && (
        <section className="bg-muted/30 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4"
                data-testid="featured-guides-title"
              >
                Spotlight Featured Guides
              </h2>
              <p className="font-sans text-muted-foreground max-w-2xl mx-auto">Curated collections of the best spots for every occasion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-testid="featured-guides-grid">
              {featuredGuides.map((guide) => (
                <Link key={guide.id} href={`/categories/featured-guides/${guide.slug}`}>
                  <Card className="overflow-hidden border-0 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md bg-card h-full" data-testid={`guide-card-${guide.slug}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {guide.image ? (
                        <img
                          src={guide.image}
                          alt={guide.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                        {guide.name}
                      </h3>
                      {guide.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {guide.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/categories/featured-guides">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-sans uppercase tracking-wider"
                  data-testid="view-all-guides"
                >
                  View All Guides
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="bg-card border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2
            className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4"
            data-testid="cta-title"
          >
            Have a Restaurant Recommendation?
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">I'm always on the hunt for my next great meal. Share your favorite spots and I might feature them!</p>
          <Button
            variant="default"
            size="lg"
            className="font-sans uppercase tracking-wider"
            data-testid="contact-cta"
            onClick={() => setContactModalOpen(true)}
          >
            Get in Touch
          </Button>
        </div>
      </section>

      <ContactFormModal 
        open={contactModalOpen} 
        onOpenChange={setContactModalOpen}
        showTrigger={false}
      />
    </div>
  );
}
