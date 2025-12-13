import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showNumeric?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  light?: boolean;
}

export default function StarRating({
  rating,
  maxRating = 5,
  showNumeric = true,
  size = "md",
  light = false,
}: StarRatingProps) {
  const sizeClasses = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const starColor = light 
    ? "fill-primary text-primary" 
    : "fill-primary text-primary";
  
  const emptyColor = light 
    ? "fill-none text-white/40" 
    : "fill-none text-muted-foreground/40";
  
  const textColor = light 
    ? "text-white" 
    : "text-black";

  return (
    <div className="flex items-center gap-1" data-testid="star-rating">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fillAmount = Math.min(Math.max(rating - index, 0), 1);
          const isFull = fillAmount === 1;
          const isEmpty = fillAmount === 0;
          const isPartial = fillAmount > 0 && fillAmount < 1;

          if (isEmpty) {
            return (
              <Star
                key={index}
                className={`${sizeClasses[size]} ${emptyColor}`}
                data-testid={`star-${index + 1}`}
              />
            );
          }

          if (isFull) {
            return (
              <Star
                key={index}
                className={`${sizeClasses[size]} ${starColor}`}
                data-testid={`star-${index + 1}`}
              />
            );
          }

          // Partial star - clip filled star to show decimal portion
          return (
            <div key={index} className="relative inline-block">
              <Star
                className={`${sizeClasses[size]} ${emptyColor}`}
                data-testid={`star-${index + 1}-empty`}
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillAmount * 100}%` }}
              >
                <Star
                  className={`${sizeClasses[size]} ${starColor}`}
                  data-testid={`star-${index + 1}-partial`}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showNumeric && (
        <span
          className={`${textSizes[size]} font-medium ${textColor} ml-1`}
          data-testid="rating-numeric"
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
