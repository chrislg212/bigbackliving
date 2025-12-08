import { Link } from "wouter";
import { DollarSign, Sparkles, TrendingUp, Utensils, Star, ArrowRight } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import AnimatedSection from "@/components/AnimatedSection";
import { mockReviews } from "@/data/mockReviews";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import budgetFoodImage from "@assets/stock_images/affordable_budget_fr_9548ddd2.jpg";

export default function CollegeBudget() {
  const budgetReviews = mockReviews.filter(r => r.priceRange === "$$" || r.priceRange === "$");

  const priceHighlights = [
    { label: "Average Meal", value: "$12", icon: Utensils },
    { label: "Best Value", value: "5/5", icon: TrendingUp },
    { label: "Under $20", value: "100%", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen" data-testid="college-budget-page">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${budgetFoodImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px) saturate(0.5) brightness(0.9)",
          opacity: 0.3,
        }} />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-20 h-20 border-4 border-primary/20 rounded-full animate-float" />
          <div className="absolute bottom-20 left-10 w-32 h-32 border-4 border-primary/15 rounded-full animate-float animation-delay-300" />
          <div className="absolute top-40 left-1/4 w-12 h-12 bg-primary/20 rounded-full animate-float animation-delay-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <AnimatedSection animation="fade-in-up" className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground mb-6 animate-pulse-gold">
              <DollarSign className="w-4 h-4" />
              <span className="font-sans text-sm font-bold">Under $20</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              College Budget
              <br />
              <span className="text-primary">Eats</span>
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Proof that amazing food doesn't require a trust fund. Every restaurant here serves exceptional meals for under $20.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {priceHighlights.map((item, index) => (
                <AnimatedSection 
                  key={item.label} 
                  animation="scale-in" 
                  delay={200 + index * 100}
                >
                  <Card className="border-0 bg-card/80 backdrop-blur shadow-sm">
                    <CardContent className="p-4 text-center">
                      <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="font-serif text-2xl font-bold text-foreground">{item.value}</div>
                      <div className="font-sans text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <AnimatedSection animation="fade-in-up" className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Best Budget Finds
            </h2>
          </div>
          <p className="font-sans text-muted-foreground">Maximum flavor, minimum damage to your wallet</p>
        </AnimatedSection>

        {budgetReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {budgetReviews.slice(0, 3).map((review, index) => (
                <AnimatedSection 
                  key={review.id} 
                  animation="scale-in" 
                  delay={100 + index * 100}
                >
                  <Link href={`/review/${review.slug}`} data-testid={`hero-review-${review.id}`}>
                    <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          {review.rating}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-sans font-bold">
                          {review.priceRange}
                        </span>
                      </div>
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <span className="text-xs font-sans font-medium uppercase tracking-wider text-primary mb-1">
                          {review.cuisine}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1 transition-transform duration-300 group-hover:translate-x-2">
                          {review.name}
                        </h3>
                        <p className="font-sans text-sm text-white/70 mb-3">
                          {review.location}
                        </p>
                        <span className="inline-flex items-center gap-1 font-sans text-sm font-medium text-primary group-hover:gap-2 transition-all duration-300">
                          Read Review
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            {budgetReviews.length > 3 && (
              <AnimatedSection animation="fade-in-up" className="mb-8">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
                  More Budget-Friendly Options
                </h3>
              </AnimatedSection>
            )}

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              data-testid="budget-reviews-grid"
            >
              {budgetReviews.slice(3).map((review, index) => (
                <AnimatedSection 
                  key={review.id} 
                  animation="fade-in-up" 
                  delay={200 + index * 75}
                >
                  <ReviewCard review={review} />
                </AnimatedSection>
              ))}
            </div>
          </>
        ) : (
          <AnimatedSection animation="fade-in-up" className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-primary" />
            </div>
            <p className="font-sans text-muted-foreground mb-4">
              No budget-friendly reviews yet. Check back soon!
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              We're always on the lookout for great food at affordable prices.
            </p>
          </AnimatedSection>
        )}
      </section>
    </div>
  );
}
