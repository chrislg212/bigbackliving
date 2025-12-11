import { Mail, MapPin, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import RatingCriteriaSection from "@/components/RatingCriteriaSection";
import ContactFormModal from "@/components/ContactFormModal";
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
              <p>My philosophy is founded on the idea that food is the most human way of storytelling. I grew up in a Filipino family where the meals that were served were not only sources of nutrients but also sources of memories, love, and culture on a plate. As I aged and moved to the city of New York, I realized that each form of cuisine, each chef, and each small, humble restaurant beats with the same heart, which is the need for interpretation through flavors.</p>
              <p>This blog is the celebration of that idea. I write about restaurants not to evaluate them, but to understand them. I attempt to grasp the message of the dish, the feeling it aims to create. Whether it is about analyzing a four-dollar bowl of noodles eaten in Queens or examining a carefully plated dish eaten in Manhattan, the aims are the same: authenticity, skill, and passion.</p>
              <p>Food binds us. Food grows us. Food brings us definition. It is my mission to share these findings with candor, gratitude, and an open palate.</p>
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
                      <p className="font-sans text-sm text-muted-foreground mb-3">Have a restaurant you think I should visit or a business inquiry?</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          data-testid="contact-email"
                        >
                          <a href="mailto:bigbackliving@gmail.com">
                            <Mail className="w-4 h-4 mr-2" />
                            bigbackliving@gmail.com
                          </a>
                        </Button>
                        <ContactFormModal />
                      </div>
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
