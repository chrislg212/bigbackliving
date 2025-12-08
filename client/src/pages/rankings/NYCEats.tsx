import { MapPin, Navigation, Sparkles } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import AnimatedSection from "@/components/AnimatedSection";
import { mockReviews } from "@/data/mockReviews";
import { Badge } from "@/components/ui/badge";

const neighborhoods = [
  "Manhattan",
  "Brooklyn", 
  "Queens",
  "Bronx",
  "Staten Island",
];

export default function NYCEats() {
  const reviews = mockReviews;

  return (
    <div className="min-h-screen" data-testid="nyc-eats-page">
      <section className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float animation-delay-200" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C59D5F' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <AnimatedSection animation="fade-in-up" className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6">
              <Navigation className="w-4 h-4" />
              <span className="font-sans text-sm font-medium">Explore the Five Boroughs</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-background mb-6">
              NYC Eats
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-background/70 max-w-2xl mx-auto mb-10">
              The city that never sleeps, and neither do we. Discover the best restaurants across all five boroughs.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {neighborhoods.map((hood, index) => (
                <Badge
                  key={hood}
                  variant="outline"
                  className={`px-4 py-2 text-sm font-sans font-medium border-background/30 text-background/80 hover:bg-background/10 transition-colors cursor-pointer opacity-0 animate-fade-in-up stagger-${index + 1}`}
                >
                  <MapPin className="w-3 h-3 mr-1.5" />
                  {hood}
                </Badge>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <AnimatedSection animation="fade-in-up" className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Featured This Week
            </h2>
          </div>
          <p className="font-sans text-muted-foreground">Our top picks from around the city</p>
        </AnimatedSection>

        {reviews.length > 0 && (
          <AnimatedSection animation="fade-in-up" delay={100} className="mb-16">
            <ReviewCard review={reviews[0]} variant="featured" />
          </AnimatedSection>
        )}

        <AnimatedSection animation="fade-in-up" delay={200} className="mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
            All NYC Reviews
          </h2>
          <p className="font-sans text-muted-foreground">Every corner, every cuisine, every craving</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {reviews.slice(1, 3).map((review, index) => (
            <AnimatedSection 
              key={review.id} 
              animation="fade-in-up" 
              delay={300 + index * 100}
            >
              <ReviewCard review={review} />
            </AnimatedSection>
          ))}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="nyc-eats-grid"
        >
          {reviews.slice(3).map((review, index) => (
            <AnimatedSection 
              key={review.id} 
              animation="fade-in-up" 
              delay={400 + index * 75}
            >
              <ReviewCard review={review} />
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}
