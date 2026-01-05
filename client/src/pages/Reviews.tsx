import ReviewCard from "@/components/ReviewCard";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { Award, Sparkles, BookOpen } from "lucide-react";
import nycRestaurantsImage from "@assets/stock_images/nyc_restaurants_food_2a9fc1d4.jpg";
import { getReviews } from "@/lib/staticData";

export default function Reviews() {
  const { customImage } = usePageHeader("reviews");
  const reviews = getReviews();

  return (
    <div className="min-h-screen" data-testid="reviews-page">
      <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || nycRestaurantsImage})` }}
        />
        <div className="absolute inset-0 bg-black/80" />
        
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
      </section>

      <section className="relative mt-8 md:mt-16 z-10 max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 md:pb-24">
        <AnimatedSection animation="fade-in-up" className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            All Reviews
          </h2>
        </AnimatedSection>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
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
