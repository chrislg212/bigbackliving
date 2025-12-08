import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showNumeric?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  maxRating = 5,
  showNumeric = true,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1" data-testid="star-rating">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const halfFilled = !filled && index < rating;

          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                filled || halfFilled
                  ? "fill-primary text-primary"
                  : "fill-none text-muted-foreground/40"
              }`}
              data-testid={`star-${index + 1}`}
            />
          );
        })}
      </div>
      {showNumeric && (
        <span
          className={`${textSizes[size]} font-medium text-foreground ml-1`}
          data-testid="rating-numeric"
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
