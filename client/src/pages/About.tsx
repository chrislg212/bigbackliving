import { Mail, MapPin, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import RatingCriteriaSection from "@/components/RatingCriteriaSection";
import { usePageHeader } from "@/hooks/use-page-header";
import foodJournalismImage from "@assets/stock_images/food_journalism_culi_9e0224b8.jpg";

export default function About() {
  const { customImage } = usePageHeader("about");

  return (
    <div className="min-h-screen" data-testid="about-page">
      <PageHeader
        title="Christopher Gamboa"
        subtitle="My name is Christopher, and I'm a junior at New York University, where I'm pursuing a degree in Finance. Raised in a Filipino family, I feel blessed to be able to experience the best flavors and comfort food in the world daily. I'm hoping to find the best dining options in New York City in the coming years, taking into consideration the best quality and price options in fine dining and lesser-known dining destinations too. Food has the incredible capacity to heal the soul and to bring people closer to each other in a way that nothing else can."
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
                      <p className="font-sans text-sm text-muted-foreground">Expand my taste palette and share the best spots from New York. I am journey to find the best matcha as well. </p>
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
                      <p className="font-sans text-sm text-muted-foreground">Based in New York City, I explore restaurants across all five boroughs. I review restaurant in Maryland (Home State) and Europe as well. </p>
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
                      <p className="font-sans text-sm text-muted-foreground mb-2">Have a restaurant you think I should visit or a business inquiry?</p>
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
      <RatingCriteriaSection />
    </div>
  );
}
