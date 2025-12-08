import { Card, CardContent } from "@/components/ui/card";
import { FileText, Video, Mic, Camera } from "lucide-react";

export default function Content() {
  // todo: remove mock functionality - fetch actual content
  const contentTypes = [
    {
      icon: FileText,
      title: "Articles",
      description: "In-depth food essays, restaurant features, and culinary explorations",
      count: 24,
    },
    {
      icon: Video,
      title: "Videos",
      description: "Behind-the-scenes kitchen tours and chef interviews",
      count: 12,
    },
    {
      icon: Mic,
      title: "Podcast",
      description: "Weekly conversations with chefs, restaurateurs, and food critics",
      count: 36,
    },
    {
      icon: Camera,
      title: "Photo Essays",
      description: "Visual stories celebrating food culture and dining experiences",
      count: 18,
    },
  ];

  return (
    <div className="min-h-screen" data-testid="content-page">
      <section className="bg-card border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground text-center mb-4"
            data-testid="page-title"
          >
            Content
          </h1>
          <p className="font-sans text-muted-foreground text-center max-w-2xl mx-auto">
            Beyond reviews: articles, videos, podcasts, and more culinary content.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          data-testid="content-grid"
        >
          {contentTypes.map((content) => (
            <Card
              key={content.title}
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-md bg-primary/10">
                    <content.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {content.title}
                      </h3>
                      <span className="font-sans text-xs text-muted-foreground">
                        {content.count} pieces
                      </span>
                    </div>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                      {content.description}
                    </p>
                    <span className="inline-block mt-4 text-sm font-sans font-medium text-primary hover:underline">
                      Browse {content.title}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-sans text-muted-foreground">
            More content coming soon. Stay tuned for new articles and features.
          </p>
        </div>
      </section>
    </div>
  );
}
