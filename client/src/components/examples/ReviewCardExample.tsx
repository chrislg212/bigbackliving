import ReviewCard from "../ReviewCard";
import pastaImage from "@assets/generated_images/italian_pasta_dish.png";

export default function ReviewCardExample() {
  // todo: remove mock functionality
  const mockReview = {
    id: "1",
    slug: "la-bella-italia",
    name: "La Bella Italia",
    cuisine: "Italian",
    location: "Downtown Manhattan",
    rating: 4.5,
    excerpt:
      "An authentic Italian experience with handmade pasta and a wine selection that rivals the best trattorias in Rome.",
    image: pastaImage,
    priceRange: "$$$",
  };

  return <ReviewCard review={mockReview} />;
}
