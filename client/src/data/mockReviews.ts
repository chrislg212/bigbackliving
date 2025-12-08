import pastaImage from "@assets/generated_images/italian_pasta_dish.png";
import steakImage from "@assets/generated_images/grilled_steak_dish.png";
import sushiImage from "@assets/generated_images/japanese_sushi_platter.png";
import pizzaImage from "@assets/generated_images/wood-fired_artisan_pizza.png";
import dessertImage from "@assets/generated_images/french_chocolate_dessert.png";
import paellaImage from "@assets/generated_images/spanish_seafood_paella.png";

import type { Review } from "@/components/ReviewCard";

// todo: remove mock functionality - replace with real data
export const mockReviews: Review[] = [
  {
    id: "1",
    slug: "la-bella-italia",
    name: "La Bella Italia",
    cuisine: "Italian",
    location: "Downtown Manhattan, NY",
    rating: 4.5,
    excerpt:
      "An authentic Italian experience with handmade pasta and a wine selection that rivals the best trattorias in Rome.",
    image: pastaImage,
    priceRange: "$$$",
  },
  {
    id: "2",
    slug: "the-prime-cut",
    name: "The Prime Cut",
    cuisine: "Steakhouse",
    location: "Midtown, NY",
    rating: 4.8,
    excerpt:
      "Perfectly aged ribeye, impeccable service, and an atmosphere that defines modern elegance. A carnivore's paradise.",
    image: steakImage,
    priceRange: "$$$$",
  },
  {
    id: "3",
    slug: "sakura-omakase",
    name: "Sakura Omakase",
    cuisine: "Japanese",
    location: "West Village, NY",
    rating: 5.0,
    excerpt:
      "A transcendent omakase experience. Each piece of nigiri tells a story of precision and respect for ingredients.",
    image: sushiImage,
    priceRange: "$$$$",
  },
  {
    id: "4",
    slug: "napolis-fire",
    name: "Napoli's Fire",
    cuisine: "Pizza",
    location: "Brooklyn, NY",
    rating: 4.3,
    excerpt:
      "Wood-fired perfection in every bite. The charred crust and fresh mozzarella transport you straight to Naples.",
    image: pizzaImage,
    priceRange: "$$",
  },
  {
    id: "5",
    slug: "maison-du-chocolat",
    name: "Maison du Chocolat",
    cuisine: "French Patisserie",
    location: "Upper East Side, NY",
    rating: 4.7,
    excerpt:
      "Exquisite French desserts crafted with artistry. The chocolate mousse is nothing short of divine.",
    image: dessertImage,
    priceRange: "$$$",
  },
  {
    id: "6",
    slug: "el-mar-azul",
    name: "El Mar Azul",
    cuisine: "Spanish",
    location: "SoHo, NY",
    rating: 4.6,
    excerpt:
      "Authentic paella bursting with the flavors of the Mediterranean. A celebration of Spanish coastal cuisine.",
    image: paellaImage,
    priceRange: "$$$",
  },
];

// Extended review content for individual review pages
// todo: remove mock functionality
export const reviewDetails: Record<
  string,
  {
    fullReview: string;
    highlights: string[];
    atmosphere: string;
    mustTry: string[];
    visitDate: string;
  }
> = {
  "la-bella-italia": {
    fullReview: `Stepping into La Bella Italia feels like being transported to a cozy trattoria in the heart of Rome. The warm lighting, exposed brick walls, and the gentle hum of Italian classics create an ambiance that immediately puts you at ease.

The menu is a love letter to traditional Italian cuisine, with each dish crafted using recipes passed down through generations. We started with their burrata, served with heirloom tomatoes and a drizzle of aged balsamic that was nothing short of revelatory.

For the main course, the handmade tagliatelle with wild boar ragu was the undisputed star. The pasta had that perfect al dente bite, and the sauce—slow-cooked for hours—had a depth of flavor that modern shortcuts simply cannot replicate.

The wine list is thoughtfully curated, with gems from lesser-known Italian regions that pair beautifully with the menu. Our sommelier's recommendation of a Barolo was exceptional.`,
    highlights: [
      "Handmade pasta daily",
      "Extensive Italian wine list",
      "Romantic atmosphere",
      "Family recipes",
    ],
    atmosphere: "Romantic and intimate with Old World charm",
    mustTry: ["Burrata Caprese", "Tagliatelle al Ragu", "Tiramisu"],
    visitDate: "November 2024",
  },
  "the-prime-cut": {
    fullReview: `The Prime Cut sets the gold standard for steakhouses in Manhattan. From the moment you walk through the heavy oak doors, you know you're in for something special.

The dry-aged ribeye, our centerpiece for the evening, was a masterclass in beef. Forty-five days of aging had developed a complex, almost nutty flavor profile, while the expert grilling achieved that coveted charred exterior and perfectly pink center.

Side dishes here are not an afterthought. The truffle creamed spinach and the loaded baked potato could easily anchor lesser establishments. The bone marrow appetizer, served with grilled sourdough, was an indulgent start.

Service was impeccable—attentive without being intrusive, knowledgeable without being pretentious. This is where you come to celebrate, to impress, or simply to enjoy beef at its absolute finest.`,
    highlights: [
      "45-day dry-aged beef",
      "Tableside preparation",
      "Extensive whiskey collection",
      "Private dining rooms",
    ],
    atmosphere: "Classic steakhouse elegance with modern touches",
    mustTry: ["Dry-Aged Ribeye", "Bone Marrow", "Truffle Creamed Spinach"],
    visitDate: "October 2024",
  },
  "sakura-omakase": {
    fullReview: `Sakura Omakase is not just a meal—it's a performance, a meditation, and a journey through the seasons of Japan. Chef Tanaka, with over three decades of experience, orchestrates an evening that transcends ordinary dining.

The 18-course omakase unfolded over three hours, each piece of nigiri more impressive than the last. The otoro, flown in from Tsukiji that morning, dissolved on the tongue with a richness that words struggle to capture.

What sets Sakura apart is the dialogue between chef and diner. Chef Tanaka adjusts each course based on your reactions, creating a truly personalized experience. The uni from Hokkaido, served over warm rice, was a revelation.

The space is intimate—only eight seats at the hinoki counter—creating an atmosphere of exclusivity and focus. This is Japanese cuisine at its most pure and elevated.`,
    highlights: [
      "18-course omakase",
      "Fish flown daily from Japan",
      "Intimate 8-seat counter",
      "Master chef with 30+ years experience",
    ],
    atmosphere: "Zen-like serenity with intimate counter seating",
    mustTry: [
      "Seasonal Omakase",
      "Hokkaido Uni",
      "A5 Wagyu Nigiri",
    ],
    visitDate: "December 2024",
  },
  "napolis-fire": {
    fullReview: `In a city obsessed with pizza, Napoli's Fire manages to stand out by doing one thing extraordinarily well: staying true to Neapolitan tradition while executing it flawlessly.

The 900-degree wood-fired oven, imported piece by piece from Naples, produces pies with that characteristic leopard-spotted char and pillowy, slightly chewy crust. The Margherita DOC—San Marzano tomatoes, buffalo mozzarella from Campania, fresh basil, and olive oil—is pizza reduced to its purest, most perfect form.

Beyond the classics, the seasonal specials show creativity without abandoning tradition. The autumn truffle pizza, with its earthy aroma and delicate shavings, was memorable.

The space is casual and energetic, perfect for a quick dinner or lingering over a bottle of Chianti. This is Brooklyn pizza culture at its finest.`,
    highlights: [
      "Imported Naples wood-fired oven",
      "Certified Neapolitan ingredients",
      "Casual neighborhood vibe",
      "BYOB friendly",
    ],
    atmosphere: "Casual Brooklyn pizzeria with authentic Naples touches",
    mustTry: ["Margherita DOC", "Diavola", "Seasonal Truffle Pizza"],
    visitDate: "November 2024",
  },
  "maison-du-chocolat": {
    fullReview: `Maison du Chocolat is where Parisian patisserie tradition meets New York sophistication. Every creation here is a small work of art, almost too beautiful to eat—almost.

The chocolate mousse, their signature, is a study in texture and balance. A shatteringly thin chocolate shell gives way to an impossibly light mousse, anchored by a hazelnut praline base. It's the kind of dessert that makes you close your eyes and savor.

The afternoon tea service is particularly special, offering a parade of petit fours, macarons, and seasonal fruit tarts alongside rare tea selections. The passion fruit éclair, with its perfect choux and tangy curd, was a highlight.

The space evokes a refined Parisian salon, all marble and gold accents. Service is formal but warm, adding to the sense of occasion.`,
    highlights: [
      "Parisian-trained pastry chefs",
      "Daily fresh creations",
      "Afternoon tea service",
      "Chocolate bonbon collection",
    ],
    atmosphere: "Elegant Parisian salon with sophisticated service",
    mustTry: ["Chocolate Mousse", "Passion Fruit Éclair", "Seasonal Tart"],
    visitDate: "October 2024",
  },
  "el-mar-azul": {
    fullReview: `El Mar Azul brings the sun-drenched flavors of the Spanish coast to SoHo with remarkable authenticity. The moment you enter, the lively atmosphere and aroma of saffron transport you to Barcelona.

The paella valenciana, cooked to order in a traditional wide pan, is the reason to visit. The socarrat—that prized crispy rice layer at the bottom—is executed perfectly. Generous portions of shrimp, mussels, and clams dot the saffron-tinged rice, each bite a taste of the Mediterranean.

Beyond paella, the tapas selection is impressive. The jamón ibérico, sliced paper-thin and served at room temperature, was exceptional. The patatas bravas, with their addictive aioli, disappeared almost instantly.

The sangria, made with a secret family recipe, is the perfect accompaniment. Pair it with the energy of the room and you have a complete Spanish experience.`,
    highlights: [
      "Traditional paella cooked to order",
      "Extensive tapas menu",
      "Spanish wine and sherry selection",
      "Lively atmosphere",
    ],
    atmosphere: "Vibrant Spanish taverna with energetic ambiance",
    mustTry: ["Paella Valenciana", "Jamón Ibérico", "House Sangria"],
    visitDate: "November 2024",
  },
};
