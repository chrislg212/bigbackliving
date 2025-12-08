import { Mail, MapPin, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen" data-testid="about-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            About The Palate
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            The story behind our passion for exceptional dining experiences.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Our Philosophy
            </h2>
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
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-md bg-primary/10">
                    <Utensils className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      Our Mission
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      To guide food lovers toward exceptional dining experiences
                      through honest, thoughtful, and beautifully presented
                      reviews.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-md bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      Where We Review
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      Based in New York City, we explore restaurants across all
                      five boroughs and beyond, from neighborhood favorites to
                      destination dining.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
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
          </div>
        </div>
      </section>

      <section className="bg-card border-t border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            How We Rate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { score: "5.0", label: "Exceptional" },
              { score: "4.0+", label: "Excellent" },
              { score: "3.0+", label: "Good" },
              { score: "< 3.0", label: "Fair" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-serif text-3xl font-bold text-primary mb-2">
                  {item.score}
                </div>
                <div className="font-sans text-sm text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
