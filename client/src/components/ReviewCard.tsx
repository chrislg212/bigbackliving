import { Link } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "./StarRating";

export interface Review {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  excerpt: string;
  image: string;
  priceRange: string;
}

interface ReviewCardProps {
  review: Review;
  variant?: "default" | "compact" | "featured";
}

export default function ReviewCard({ review, variant = "default" }: ReviewCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/review/${review.slug}`}>
        <Card
          className="group cursor-pointer overflow-hidden border-0 shadow-md card-hover-lift"
          data-testid={`review-card-${review.id}`}
        >
          <div className="aspect-[16/9] overflow-hidden relative">
            <img
              src={review.image}
              alt={review.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-testid={`review-image-${review.id}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-sans font-medium uppercase tracking-wider rounded-full mb-3">
                {review.cuisine}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-2">
                {review.name}
              </h3>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-sans">{review.location}</span>
                <span className="text-white/60 mx-2">|</span>
                <StarRating rating={review.rating} size="sm" light />
              </div>
            </div>
          </div>
          <CardContent className="p-5">
            <p className="font-sans text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
              {review.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-sans font-medium text-primary group-hover:gap-3 transition-all">
              Read Full Review
              <ArrowRight className="w-4 h-4 arrow-hover-right" />
            </span>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/review/${review.slug}`}>
        <Card
          className="group cursor-pointer overflow-hidden border-0 shadow-sm card-hover-lift flex flex-row"
          data-testid={`review-card-${review.id}`}
        >
          <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
            <img
              src={review.image}
              alt={review.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-primary mb-1">
              {review.cuisine}
            </span>
            <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {review.name}
            </h3>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="xs" />
              <span className="text-xs text-muted-foreground">{review.priceRange}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/review/${review.slug}`}>
      <Card
        className="group cursor-pointer overflow-hidden border-0 shadow-sm card-hover-lift card-hover-zoom"
        data-testid={`review-card-${review.id}`}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={review.image}
            alt={review.name}
            className="w-full h-full object-cover"
            data-testid={`review-image-${review.id}`}
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className="text-xs font-sans font-medium uppercase tracking-wider text-primary"
              data-testid={`review-cuisine-${review.id}`}
            >
              {review.cuisine}
            </span>
            <span className="text-xs font-sans text-muted-foreground">
              {review.priceRange}
            </span>
          </div>

          <h3
            className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
            data-testid={`review-name-${review.id}`}
          >
            {review.name}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="w-3 h-3" />
            <span
              className="text-xs font-sans"
              data-testid={`review-location-${review.id}`}
            >
              {review.location}
            </span>
          </div>

          <StarRating rating={review.rating} size="sm" />

          <p
            className="font-sans text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed"
            data-testid={`review-excerpt-${review.id}`}
          >
            {review.excerpt}
          </p>

          <span
            className="inline-flex items-center gap-1 mt-4 text-sm font-sans font-medium text-primary group-hover:gap-2 transition-all"
            data-testid={`review-link-${review.id}`}
          >
            Read Review
            <ArrowRight className="w-3 h-3 arrow-hover-right" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
