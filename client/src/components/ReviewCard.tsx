import { Link } from "wouter";
import { MapPin } from "lucide-react";
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
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/review/${review.slug}`}>
      <Card
        className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
        data-testid={`review-card-${review.id}`}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={review.image}
            alt={review.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            className="inline-block mt-4 text-sm font-sans font-medium text-primary hover:underline"
            data-testid={`review-link-${review.id}`}
          >
            Read Review
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
