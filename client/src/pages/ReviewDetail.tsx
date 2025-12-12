import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin, DollarSign, Clock, Utensils, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import PhotoGallery from "@/components/PhotoGallery";
import { getReviews, getReviewBySlug } from "@/lib/staticData";
import type { GalleryImage } from "@shared/schema";

export default function ReviewDetail() {
  const { slug } = useParams<{ slug: string }>();

  const review = getReviewBySlug(slug || "");
  const reviews = getReviews();
  const relatedReviews = reviews.filter((r) => r.slug !== slug).slice(0, 3);

  if (!review) {
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
          className="absolute inset-0 bg-cover bg-center bg-muted"
          style={{ backgroundImage: review.image ? `url(${review.image})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 w-full">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/reviews">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10"
                data-testid="back-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Reviews
              </Button>
            </Link>

            <Badge
              variant="secondary"
              className="bg-primary/90 text-primary-foreground border-0"
            >
              {review.cuisine}
            </Badge>
          </div>

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

      {review.vibes && review.vibes.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6" data-testid="vibes-section">
          <div className="flex flex-wrap gap-2">
            {review.vibes.map((vibe) => (
              <Badge
                key={vibe}
                className="font-sans text-sm px-4 py-1.5 rounded-full bg-primary/80 backdrop-blur-sm text-primary-foreground border border-primary/30 shadow-md hover:scale-105 transition-transform duration-200"
              >
                {vibe}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 space-y-8">
            {review.aboutBusiness && (
              <div data-testid="about-business">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  About the Restaurant
                </h2>
                <p className="font-sans text-base md:text-lg text-foreground leading-relaxed">
                  {review.aboutBusiness}
                </p>
              </div>
            )}
            <div data-testid="my-review">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                My Review
              </h2>
              <article
                className="font-sans text-foreground leading-relaxed space-y-6"
                data-testid="review-content"
              >
                {(review.fullReview || review.excerpt).split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </article>
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Quick Info
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Utensils className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-1">
                        Cuisine
                      </div>
                      <div className="font-sans text-base text-foreground">
                        {review.cuisine}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-1">
                        Location
                      </div>
                      <div className="font-sans text-base text-foreground">
                        {review.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DollarSign className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-1">
                        Price Range
                      </div>
                      <div className="font-sans text-base text-foreground">
                        {review.priceRange}
                      </div>
                    </div>
                  </div>
                  {review.visitDate && (
                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-1">
                          Visited
                        </div>
                        <div className="font-sans text-base text-foreground">
                          {review.visitDate}
                        </div>
                      </div>
                    </div>
                  )}
                  {review.address && (
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-1">
                          Address
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-base text-foreground hover:text-primary transition-colors flex items-center gap-1"
                          data-testid="link-address"
                        >
                          {review.address}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                  {review.website && (
                    <div className="flex items-start gap-4">
                      <Globe className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-1">
                          Website
                        </div>
                        <a
                          href={review.website.startsWith('http') ? review.website : `https://${review.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-base text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                          data-testid="link-website"
                        >
                          Visit website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div data-testid="ad-placement" className="min-h-[250px]">
              {/* Ad code goes here */}
            </div>

            {review.mustTry && review.mustTry.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                    Must Try
                  </h3>
                  <ul className="space-y-2">
                    {review.mustTry.map((item) => (
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

            {review.highlights && review.highlights.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                    Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {review.highlights.map((highlight) => (
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

        {review.galleryImages && (review.galleryImages as GalleryImage[]).length > 0 && (
          <div className="mt-6 pt-6 border-t border-primary/10">
            <PhotoGallery 
              images={review.galleryImages as GalleryImage[]} 
              title="Photos"
            />
          </div>
        )}
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
