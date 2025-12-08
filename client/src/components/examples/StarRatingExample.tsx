import StarRating from "../StarRating";

export default function StarRatingExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <StarRating rating={4.5} size="lg" />
      <StarRating rating={3} size="md" />
      <StarRating rating={5} size="sm" showNumeric={false} />
    </div>
  );
}
