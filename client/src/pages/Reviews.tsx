import { Link } from "wouter";
import ReviewCard from "@/components/ReviewCard";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { Star, ArrowRight, Award, Sparkles, BookOpen } from "lucide-react";
import nycRestaurantsImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";
import { getReviews } from "@/lib/staticData";

export default function Reviews() {
  const { customImage } = usePageHeader("reviews");
  const reviews = getReviews();

  return (
    <div className="min-h-screen" data-testid="reviews-page">
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || nycRestaurantsImage})` }}
        />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="absolute top-8 left-8 opacity-30 hidden md:block">
          <BookOpen className="w-12 h-12 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-12 right-12 opacity-20 hidden md:block">
          <Award className="w-16 h-16 text-white" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Honest Opinions
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
              My Reviews
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Thoughtful, honest reviews of the restaurants that shaped my palate. 
              From quiet neighborhood discoveries to the city's most iconic dining rooms.
            </p>
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative mt-8 md:-mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <AnimatedSection animation="fade-in-up" className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">My Picks</h2>
          </div>
          <p className="font-sans text-muted-foreground">My highest-rated restaurant experiences</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {reviews.slice(0, 3).map((review, index) => (
            <AnimatedSection key={review.id} animation="scale-in" delay={index * 100}>
              <Link href={`/review/${review.slug}`} data-testid={`hero-review-${review.id}`}>
                <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer card-hover-lift gold-glow-hover">
                  <img
                    src={review.image || ""}
                    alt={review.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      {review.rating}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-sans">
                      {review.cuisine}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
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

        <AnimatedSection animation="fade-in-up" className="mb-8">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
            All Reviews
          </h3>
        </AnimatedSection>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="all-reviews-grid"
        >
          {reviews.map((review, index) => (
            <AnimatedSection 
              key={review.id} 
              animation="fade-in-up" 
              delay={index * 75}
            >
              <ReviewCard review={review} />
            </AnimatedSection>
          ))}
        </div>

        {reviews.length === 0 && (
          <AnimatedSection animation="fade-in" className="text-center py-16">
            <p className="font-sans text-muted-foreground">
              No reviews yet. Check back soon!
            </p>
          </AnimatedSection>
        )}
      </section>
    </div>
  );
}
