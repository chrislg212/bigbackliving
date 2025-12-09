import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, DollarSign, Clock, Utensils, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import { mockReviews, reviewDetails } from "@/data/mockReviews";
import type { Review as DBReview } from "@shared/schema";

export default function ReviewDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: dbReviews = [], isLoading } = useQuery<DBReview[]>({
    queryKey: ["/api/reviews"],
  });

  const dbReview = dbReviews.find((r) => r.slug === slug);
  const mockReview = mockReviews.find((r) => r.slug === slug);
  const mockDetails = slug ? reviewDetails[slug] : null;

  const review = dbReview 
    ? {
        id: String(dbReview.id),
        slug: dbReview.slug,
        name: dbReview.name,
        cuisine: dbReview.cuisine,
        location: dbReview.location,
        rating: dbReview.rating,
        excerpt: dbReview.excerpt,
        image: dbReview.image || "",
        priceRange: dbReview.priceRange,
      }
    : mockReview;

  const details = dbReview
    ? {
        fullReview: dbReview.fullReview || dbReview.excerpt,
        highlights: dbReview.highlights || [],
        atmosphere: dbReview.atmosphere || "",
        mustTry: dbReview.mustTry || [],
        visitDate: dbReview.visitDate || "",
      }
    : mockDetails;

  const allReviews = dbReviews.length > 0 
    ? dbReviews.map(r => ({
        id: String(r.id),
        slug: r.slug,
        name: r.name,
        cuisine: r.cuisine,
        location: r.location,
        rating: r.rating,
        excerpt: r.excerpt,
        image: r.image || "",
        priceRange: r.priceRange,
      }))
    : mockReviews;
  
  const relatedReviews = allReviews.filter((r) => r.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!review || !details) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        data-testid="review-not-found"
      >
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">
          Review Not Found
        </h1>
        <p className="font-sans text-muted-foreground mb-8">
          The review you're looking for doesn't exist.
        </p>
        <Link href="/reviews">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="review-detail-page">
      <section
        className="relative w-full h-[40vh] md:h-[50vh] flex items-end"
        data-testid="review-hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${review.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 w-full">
          <Link href="/reviews">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Reviews
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="bg-primary/90 text-primary-foreground border-0 mb-3"
          >
            {review.cuisine}
          </Badge>

          <h1
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4"
            data-testid="review-title"
          >
            {review.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <StarRating rating={review.rating} size="lg" light />
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="font-sans text-sm">{review.location}</span>
            </div>
            <span className="font-sans text-sm">{review.priceRange}</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <article
              className="font-sans text-foreground leading-relaxed space-y-6"
              data-testid="review-content"
            >
              {details.fullReview.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="text-base md:text-lg">
                  {paragraph}
                </p>
              ))}
            </article>
          </div>

          <aside className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Quick Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Utensils className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Cuisine
                      </div>
                      <div className="font-sans text-sm text-foreground">
                        {review.cuisine}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Location
                      </div>
                      <div className="font-sans text-sm text-foreground">
                        {review.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Price Range
                      </div>
                      <div className="font-sans text-sm text-foreground">
                        {review.priceRange}
                      </div>
                    </div>
                  </div>
                  {details.visitDate && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary mt-1" />
                      <div>
                        <div className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Visited
                        </div>
                        <div className="font-sans text-sm text-foreground">
                          {details.visitDate}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {details.mustTry && details.mustTry.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                    Must Try
                  </h3>
                  <ul className="space-y-2">
                    {details.mustTry.map((item) => (
                      <li
                        key={item}
                        className="font-sans text-sm text-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {details.highlights && details.highlights.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                    Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {details.highlights.map((highlight) => (
                      <Badge
                        key={highlight}
                        variant="secondary"
                        className="font-sans text-xs"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </section>

      {relatedReviews.length > 0 && (
        <section className="bg-card border-t border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
              More Reviews
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              data-testid="related-reviews"
            >
              {relatedReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
