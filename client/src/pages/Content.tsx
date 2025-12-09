import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { ExternalLink } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import foodPhotographyImage from "@assets/stock_images/food_photography_soc_438b2452.jpg";
import type { SocialSettings, SocialEmbed } from "@shared/schema";

type Platform = "instagram" | "tiktok";

function EmbedRenderer({ embedCode, platform }: { embedCode: string; platform: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (platform === "instagram" && (window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [embedCode, platform]);

  return (
    <div 
      className="embed-container flex justify-center"
      dangerouslySetInnerHTML={{ __html: embedCode }}
    />
  );
}

export default function Content() {
  const [activePlatform, setActivePlatform] = useState<Platform>("instagram");
  const { customImage } = usePageHeader("content");

  const { data: socialSettings = [], isLoading } = useQuery<SocialSettings[]>({
    queryKey: ["/api/social-settings"],
  });

  const { data: embeds = [] } = useQuery<SocialEmbed[]>({
    queryKey: ["/api/social-embeds"],
  });

  const instagramSettings = socialSettings.find(s => s.platform === "instagram");
  const tiktokSettings = socialSettings.find(s => s.platform === "tiktok");

  const platformEmbeds = embeds
    .filter(e => e.platform === activePlatform)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  useEffect(() => {
    const loadInstagramScript = () => {
      if (!(window as any).instgrm) {
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        (window as any).instgrm.Embeds.process();
      }
    };

    const loadTikTokScript = () => {
      if (!document.querySelector('script[src*="tiktok.com/embed.js"]')) {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    if (platformEmbeds.length > 0) {
      if (activePlatform === "instagram") {
        loadInstagramScript();
      } else if (activePlatform === "tiktok") {
        loadTikTokScript();
      }
    }
  }, [activePlatform, platformEmbeds]);

  const handleFollowClick = (url: string | undefined) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen" data-testid="content-page">
      <PageHeader
        title="Follow My Journey"
        subtitle="Behind the reviews, beyond the plates"
        backgroundImage={customImage || foodPhotographyImage}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <AnimatedSection animation="fade-in-up" className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-card p-1.5 shadow-sm">
            <Button
              variant={activePlatform === "instagram" ? "default" : "ghost"}
              className={`rounded-full px-6 py-2 gap-2 ${activePlatform === "instagram" ? "btn-hover-lift" : ""}`}
              onClick={() => setActivePlatform("instagram")}
              data-testid="tab-instagram"
            >
              <SiInstagram className="w-4 h-4" />
              Instagram
            </Button>
            <Button
              variant={activePlatform === "tiktok" ? "default" : "ghost"}
              className={`rounded-full px-6 py-2 gap-2 ${activePlatform === "tiktok" ? "btn-hover-lift" : ""}`}
              onClick={() => setActivePlatform("tiktok")}
              data-testid="tab-tiktok"
            >
              <SiTiktok className="w-4 h-4" />
              TikTok
            </Button>
          </div>
        </AnimatedSection>

        {activePlatform === "instagram" && (
          <div className="space-y-8">
            <AnimatedSection animation="fade-in" className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-amber-400 to-primary p-0.5">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <SiInstagram className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {instagramSettings?.username || "@thepalate"}
                  </h3>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="gap-2 btn-hover-lift"
                onClick={() => handleFollowClick(instagramSettings?.profileUrl)}
                disabled={!instagramSettings?.profileUrl}
                data-testid="button-follow-instagram"
              >
                <ExternalLink className="w-4 h-4" />
                Follow
              </Button>
            </AnimatedSection>

            {platformEmbeds.length > 0 ? (
              <div className="space-y-6" data-testid="instagram-embeds">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {platformEmbeds.map((embed) => (
                    <div key={embed.id} className="flex flex-col items-center" data-testid={`embed-${embed.id}`}>
                      {embed.title && (
                        <p className="text-sm text-muted-foreground mb-2">{embed.title}</p>
                      )}
                      <EmbedRenderer embedCode={embed.embedCode} platform={embed.platform} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No Instagram posts yet. Add embeds in the admin panel.</p>
              </div>
            )}
          </div>
        )}

        {activePlatform === "tiktok" && (
          <div className="space-y-8">
            <AnimatedSection animation="fade-in" className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center">
                  <SiTiktok className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {tiktokSettings?.username || "@thepalate"}
                  </h3>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="gap-2 btn-hover-lift"
                onClick={() => handleFollowClick(tiktokSettings?.profileUrl)}
                disabled={!tiktokSettings?.profileUrl}
                data-testid="button-follow-tiktok"
              >
                <ExternalLink className="w-4 h-4" />
                Follow
              </Button>
            </AnimatedSection>

            {platformEmbeds.length > 0 ? (
              <div className="space-y-6" data-testid="tiktok-embeds">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {platformEmbeds.map((embed) => (
                    <div key={embed.id} className="flex flex-col items-center" data-testid={`embed-${embed.id}`}>
                      {embed.title && (
                        <p className="text-sm text-muted-foreground mb-2">{embed.title}</p>
                      )}
                      <EmbedRenderer embedCode={embed.embedCode} platform={embed.platform} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No TikTok videos yet. Add embeds in the admin panel.</p>
              </div>
            )}
          </div>
        )}

        <AnimatedSection animation="fade-in-up" delay={400} className="mt-16 text-center">
          <p className="font-sans text-muted-foreground mb-4">
            Follow us for daily food discoveries, behind-the-scenes content, and exclusive reviews.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="gap-2 btn-hover-lift"
              onClick={() => handleFollowClick(instagramSettings?.profileUrl)}
              disabled={!instagramSettings?.profileUrl}
            >
              <SiInstagram className="w-4 h-4" />
              Instagram
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 btn-hover-lift"
              onClick={() => handleFollowClick(tiktokSettings?.profileUrl)}
              disabled={!tiktokSettings?.profileUrl}
            >
              <SiTiktok className="w-4 h-4" />
              TikTok
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
