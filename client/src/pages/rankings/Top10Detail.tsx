import { useParams, Link } from "wouter";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import StarRating from "@/components/StarRating";
import { mockReviews } from "@/data/mockReviews";

import dateNightImage from "@assets/stock_images/romantic_candlelit_d_a4a26dad.jpg";
import brunchImage from "@assets/stock_images/brunch_table_with_eg_e4c89727.jpg";
import hiddenGemsImage from "@assets/stock_images/hidden_alley_restaur_cf270a9f.jpg";
import rooftopImage from "@assets/stock_images/rooftop_restaurant_c_50ae76eb.jpg";
import tastingMenuImage from "@assets/stock_images/fine_dining_tasting__c5be4924.jpg";
import lateNightImage from "@assets/stock_images/late_night_street_fo_3c908d48.jpg";

interface ListData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
}

const listData: Record<string, ListData> = {
  "date-night": {
    title: "Top 10 Date Night Spots",
    subtitle: "Romance on a plate",
    description: "From candlelit Italian trattorias to intimate omakase counters, these restaurants set the perfect mood for love.",
    image: dateNightImage,
    gradient: "from-rose-900/80 via-rose-800/60 to-transparent",
  },
  brunch: {
    title: "Top 10 Brunch Spots",
    subtitle: "Weekend mornings, perfected",
    description: "Whether you're craving eggs benedict or the city's best pancakes, these spots make every weekend special.",
    image: brunchImage,
    gradient: "from-amber-900/80 via-amber-800/60 to-transparent",
  },
  "hidden-gems": {
    title: "Top 10 Hidden Gems",
    subtitle: "The best-kept secrets",
    description: "Neighborhood favorites and under-the-radar spots that deserve way more attention than they get.",
    image: hiddenGemsImage,
    gradient: "from-emerald-900/80 via-emerald-800/60 to-transparent",
  },
  rooftop: {
    title: "Top 10 Rooftop Dining",
    subtitle: "Views that match the food",
    description: "Elevated dining in every sense. Where stunning skyline views meet exceptional cuisine.",
    image: rooftopImage,
    gradient: "from-sky-900/80 via-sky-800/60 to-transparent",
  },
  "tasting-menus": {
    title: "Top 10 Tasting Menus",
    subtitle: "Culinary journeys",
    description: "Multi-course experiences that tell stories through food. Worth every course, every bite.",
    image: tastingMenuImage,
    gradient: "from-violet-900/80 via-violet-800/60 to-transparent",
  },
  "late-night": {
    title: "Top 10 Late Night Eats",
    subtitle: "The city never sleeps",
    description: "For those midnight cravings and after-hours adventures. The best food when the sun goes down.",
    image: lateNightImage,
    gradient: "from-indigo-900/80 via-indigo-800/60 to-transparent",
  },
};

export default function Top10Detail() {
  const { slug } = useParams<{ slug: string }>();
  const list = listData[slug || ""];
  const reviews = mockReviews;

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">List Not Found</h1>
          <Link href="/rankings/top-10">
            <Button variant="outline">Back to Top 10 Lists</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="top10-detail-page">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={list.image}
          alt={list.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${list.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
            <AnimatedSection animation="fade-in-up">
              <Link href="/rankings/top-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Top 10 Lists
                </Button>
              </Link>
              
              <Badge variant="outline" className="border-primary text-primary mb-4">
                <Award className="w-3 h-3 mr-1" />
                Curated List
              </Badge>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {list.title}
              </h1>
              
              <p className="font-sans text-xl text-white/80 mb-2">{list.subtitle}</p>
              <p className="font-sans text-base text-white/60 max-w-2xl">{list.description}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <AnimatedSection animation="fade-in-up" className="mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
            The Complete List
          </h2>
          <p className="font-sans text-muted-foreground">
            Ranked by our editorial team based on food quality, experience, and value.
          </p>
        </AnimatedSection>

        <div className="space-y-6">
          {reviews.slice(0, 6).map((review, index) => (
            <AnimatedSection
              key={review.id}
              animation="fade-in-left"
              delay={index * 100}
            >
              <Link href={`/review/${review.slug}`}>
                <Card className="group overflow-hidden border-0 shadow-sm card-hover-lift cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 sm:rounded-l-md">
                        <span className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground py-4 sm:py-0">
                          {index + 1}
                        </span>
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-float">
                            <Award className="w-4 h-4 text-amber-900" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-1 flex-col sm:flex-row">
                        <div className="sm:w-48 aspect-[4/3] sm:aspect-auto overflow-hidden flex-shrink-0">
                          <img
                            src={review.image}
                            alt={review.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        
                        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-sans font-medium uppercase tracking-wider text-primary">
                              {review.cuisine}
                            </span>
                            <span className="text-xs text-muted-foreground">|</span>
                            <span className="text-xs text-muted-foreground">{review.priceRange}</span>
                          </div>
                          
                          <h3 className="font-serif text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {review.name}
                          </h3>
                          
                          <p className="font-sans text-sm text-muted-foreground mb-2">
                            {review.location}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="inline-flex items-center gap-1 text-sm font-sans font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              Read Review
                              <ArrowRight className="w-3 h-3 arrow-hover-right" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in-up" delay={700} className="mt-12 text-center">
          <p className="font-sans text-sm text-muted-foreground mb-4">
            This list is updated regularly based on our latest reviews and experiences.
          </p>
          <Link href="/rankings/top-10">
            <Button variant="outline" className="btn-hover-lift gap-2">
              Explore More Lists
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
