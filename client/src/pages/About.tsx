import { Mail, MapPin, Utensils, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import foodJournalismImage from "@assets/stock_images/food_journalism_culi_9e0224b8.jpg";

export default function About() {
  const { customImage } = usePageHeader("about");
  const ratingBreakdown = [
    { score: "5.0", label: "PERFECT" },
    { score: "4.0+", label: "EXCEPTIONAL" },
    { score: "3.0", label: "DECENT" },
    { score: "< 3.0", label: "DISAPPOINTING" },
  ];

  const ratingCriteria = [
    {
      name: "Taste",
      description: "Measures overall flavor, texture, balance, and execution.",
    },
    {
      name: "Value",
      description: "Evaluates how well the quality matches the price and whether the experience feels worth it.",
    },
    {
      name: "Atmosphere",
      description: "The vibe, comfort, and overall feel of dining at the location.",
    },
    {
      name: "Service",
      description: "Friendliness, attentiveness, and efficiency of the staff.",
    },
    {
      name: "Marginal Bite Satisfaction",
      description: "A unique metric that measures how consistently enjoyable each additional bite is. Does the dish stay satisfying from start to finish, or does enjoyment fade as you continue eating?",
    },
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      <PageHeader
        title="Christopher Gamboa"
        subtitle="Stories, standards, and a passion for exceptional food"
        backgroundImage={customImage || foodJournalismImage}
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection animation="fade-in-left">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">My Philosophy</h2>
            <div className="font-sans text-muted-foreground space-y-4 leading-relaxed">
              <p>
                The Palate was born from a simple belief: every meal has the
                potential to be memorable. We seek out restaurants that
                understand this—places where passion meets precision, where
                tradition dances with innovation.
              </p>
              <p>
                Our reviews are honest, thorough, and always respectful. We
                visit anonymously, pay our own bills, and return multiple times
                before publishing. A restaurant's worst day isn't fair; neither
                is judging solely on its best.
              </p>
              <p>
                We believe great dining transcends price points. A perfect bowl
                of ramen can be as revelatory as a Michelin-starred tasting
                menu. What matters is intention, execution, and the joy of
                sharing food.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection animation="fade-in-right" delay={100}>
              <Card className="border-0 shadow-sm card-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-md bg-primary/10">
                      <Utensils className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">My Mission</h3>
                      <p className="font-sans text-sm text-muted-foreground">
                        To guide food lovers toward exceptional dining experiences
                        through honest, thoughtful, and beautifully presented
                        reviews.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-right" delay={200}>
              <Card className="border-0 shadow-sm card-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-md bg-primary/10">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Where I Review</h3>
                      <p className="font-sans text-sm text-muted-foreground">
                        Based in New York City, we explore restaurants across all
                        five boroughs and beyond, from neighborhood favorites to
                        destination dining.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-right" delay={300}>
              <Card className="border-0 shadow-sm card-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-md bg-primary/10">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                        Get in Touch
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground mb-2">
                        Have a restaurant you think we should visit? We'd love to
                        hear from you.
                      </p>
                      <a
                        href="mailto:hello@thepalate.com"
                        className="font-sans text-sm text-primary hover:underline"
                        data-testid="contact-email"
                      >
                        hello@thepalate.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
      <section className="bg-card border-t border-primary/10" data-testid="how-we-rate-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <AnimatedSection animation="fade-in-up">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">How I Rate</h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
            {ratingBreakdown.map((item, index) => (
              <AnimatedSection 
                key={item.label} 
                animation="scale-in" 
                delay={100 + index * 100}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <Star className="w-6 h-6 fill-primary text-primary" />
                </div>
                <div className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                  {item.score}
                </div>
                <div className="font-sans text-sm text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="border-t border-primary/10 pt-12">
            <AnimatedSection animation="fade-in-up" delay={500}>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground text-center mb-10">My Rating Criteria</h3>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ratingCriteria.map((criterion, index) => (
                <AnimatedSection
                  key={criterion.name}
                  animation="fade-in-up"
                  delay={600 + index * 100}
                  className={`${index === ratingCriteria.length - 1 && ratingCriteria.length % 3 !== 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {criterion.name}
                  </h4>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {criterion.description}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
