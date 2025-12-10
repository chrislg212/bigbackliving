import { useState } from "react";
import { Star, Utensils, DollarSign, Armchair, Users, Lightbulb, ChefHat } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AnimatedSection from "@/components/AnimatedSection";

interface RatingTier {
  score: string;
  label: string;
  description: string;
  starAnimation: string;
  starClass: string;
}

interface RatingCriterion {
  name: string;
  description: string;
  icon: typeof Utensils;
  detailedDescription: string;
}

const ratingTiers: RatingTier[] = [
  {
    score: "5.0",
    label: "PERFECT",
    description: "A flawless dining experience that exceeds all expectations",
    starAnimation: "animate-star-twinkle",
    starClass: "star-perfect",
  },
  {
    score: "4.0+",
    label: "EXCEPTIONAL",
    description: "Outstanding quality with minor room for improvement",
    starAnimation: "animate-star-pulse",
    starClass: "star-exceptional",
  },
  {
    score: "3.0",
    label: "DECENT",
    description: "Solid experience worth considering for a casual meal",
    starAnimation: "animate-star-grow",
    starClass: "star-decent",
  },
  {
    score: "< 3.0",
    label: "DISAPPOINTING",
    description: "Falls short of expectations in key areas",
    starAnimation: "animate-star-fade",
    starClass: "star-disappointing",
  },
];

const ratingCriteria: RatingCriterion[] = [
  {
    name: "Taste",
    description: "Measures overall flavor, texture, balance, and execution.",
    icon: Utensils,
    detailedDescription: "The key to a perfect meal is the evaluation of the balance of flavors, the qualities of the ingredients, the manner of their preparation, and the success of each dish in meeting expectations. And it starts with the very first mouthful and ends with the last. The sense of taste reigns supreme throughout.",
  },
  {
    name: "Value",
    description: "Evaluates how well the quality matches the price and whether the experience feels worth it.",
    icon: DollarSign,
    detailedDescription: "Great food doesn't have to break the bank. We assess portion sizes, ingredient quality relative to cost, and whether you leave feeling like you got your money's worth. A $10 bowl of noodles can score higher than a $100 tasting menu if the value proposition is right.",
  },
  {
    name: "Atmosphere",
    description: "The vibe, comfort, and overall feel of dining at the location.",
    icon: Armchair,
    detailedDescription: "The setting matters. We consider the ambiance, decor, noise levels, lighting, and overall comfort. Whether it's a cozy neighborhood spot or a sleek fine dining room, the atmosphere should complement and enhance the meal.",
  },
  {
    name: "Service",
    description: "Friendliness, attentiveness, and efficiency of the staff.",
    icon: Users,
    detailedDescription: "Great service is invisible yet impactful. We evaluate how the staff makes you feel, their knowledge of the menu, timing between courses, and their ability to anticipate needs without being intrusive.",
  },
  {
    name: "Creativity",
    description: "Evaluates the originality and innovation of the dishes, from flavor combinations to plating.",
    icon: Lightbulb,
    detailedDescription: "Does the kitchen push boundaries? We look for unique flavor combinations, innovative techniques, thoughtful presentation, and dishes that surprise and delight. Creativity is about taking risks that pay off.",
  },
  {
    name: "Marginal Bite Satisfaction",
    description: "A unique metric that measures how consistently enjoyable each additional bite is.",
    icon: ChefHat,
    detailedDescription: "Our signature metric. Does the dish stay satisfying from start to finish, or does enjoyment fade as you continue eating? The best dishes maintain or even increase their appeal with every bite. This separates good from truly memorable.",
  },
];

function AnimatedStars({ tier, isHovered }: { tier: RatingTier; isHovered: boolean }) {
  const starCount = tier.score === "5.0" ? 5 : tier.score === "4.0+" ? 4 : tier.score === "3.0" ? 3 : 2;
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 transition-all duration-300 ${
            i < starCount
              ? `${tier.starClass} ${isHovered ? tier.starAnimation : ""}`
              : "text-muted-foreground/20"
          }`}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}

function RatingTierCard({ tier, index }: { tier: RatingTier; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <AnimatedSection
      animation="scale-in"
      delay={100 + index * 100}
      className="text-center"
    >
      <div
        className="p-4 rounded-lg transition-all duration-300 cursor-pointer hover-elevate"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`rating-tier-${tier.label.toLowerCase()}`}
      >
        <div className="flex justify-center mb-3">
          <AnimatedStars tier={tier} isHovered={isHovered} />
        </div>
        <div className={`font-serif text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300 ${
          isHovered ? "text-primary" : "text-foreground"
        }`}>
          {tier.score}
        </div>
        <div className="font-sans text-sm text-muted-foreground uppercase tracking-wider mb-2">
          {tier.label}
        </div>
        <p className={`font-sans text-xs text-muted-foreground/70 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          {tier.description}
        </p>
      </div>
    </AnimatedSection>
  );
}

function CriterionCard({ criterion, index }: { criterion: RatingCriterion; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = criterion.icon;
  
  return (
    <AnimatedSection
      animation="fade-in-up"
      delay={600 + index * 100}
      className={`${index === ratingCriteria.length - 1 && ratingCriteria.length % 3 !== 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="group w-full text-left p-5 rounded-lg bg-background/50 border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer hover-elevate focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            data-testid={`criterion-${criterion.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-md bg-primary/10 transition-all duration-300 ${
                isHovered ? "bg-primary/20 animate-icon-pulse" : ""
              }`}>
                <Icon className={`w-5 h-5 text-primary transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-serif text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isHovered ? "text-primary" : "text-foreground"
                }`}>
                  {criterion.name}
                </h4>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {criterion.description}
                </p>
                <span className={`inline-block mt-3 font-sans text-xs text-primary transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}>
                  Click for more details
                </span>
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-4"
          side="top"
          data-testid={`popover-${criterion.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <h5 className="font-serif text-base font-semibold text-foreground">
              {criterion.name}
            </h5>
          </div>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            {criterion.detailedDescription}
          </p>
        </PopoverContent>
      </Popover>
    </AnimatedSection>
  );
}

export default function RatingCriteriaSection() {
  return (
    <section className="bg-card border-t border-primary/10" data-testid="how-we-rate-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <AnimatedSection animation="fade-in-up">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
            How I Rate
          </h2>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Every restaurant is evaluated across multiple dimensions to give you the full picture
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {ratingTiers.map((tier, index) => (
            <RatingTierCard key={tier.label} tier={tier} index={index} />
          ))}
        </div>

        <div className="border-t border-primary/10 pt-12">
          <AnimatedSection animation="fade-in-up" delay={500}>
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground text-center mb-4">
              My Rating Criteria
            </h3>
            <p className="font-sans text-sm text-muted-foreground text-center max-w-xl mx-auto mb-10">
              Hover over each criterion to see it in action, click for detailed explanations
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratingCriteria.map((criterion, index) => (
              <CriterionCard key={criterion.name} criterion={criterion} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
