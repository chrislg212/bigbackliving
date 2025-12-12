import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageHeader } from "@/hooks/use-page-header";
import { ExternalLink, ChevronDown, Sparkles } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import foodPhotographyImage from "@assets/stock_images/food_photography_soc_438b2452.jpg";
import { getSocialSettings, getSocialEmbeds } from "@/lib/staticData";

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

export default function Social() {
  const { customImage } = usePageHeader("social");

  const socialSettings = getSocialSettings();
  const embeds = getSocialEmbeds();

  const instagramSettings = socialSettings.find(s => s.platform === "instagram");
  const tiktokSettings = socialSettings.find(s => s.platform === "tiktok");

  const instagramEmbeds = embeds
    .filter(e => e.platform === "instagram")
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const tiktokEmbeds = embeds
    .filter(e => e.platform === "tiktok")
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

    loadInstagramScript();
    loadTikTokScript();
  }, []);

  const handleFollowClick = (url: string | undefined) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" data-testid="social-page">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || foodPhotographyImage})` }}
        />
        <div className="absolute inset-0 bg-black/80" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Behind the Scenes
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
              Follow My
              <br />
              <span className="text-primary">Journey</span>
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12">
              Beyond the reviews, behind the plates. Daily food discoveries, restaurant adventures, and culinary stories.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg"
                className="gap-3"
                onClick={() => scrollToSection("socials-content")}
                data-testid="scroll-instagram"
              >
                <SiInstagram className="w-5 h-5" />
                Instagram
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="gap-3 bg-black/50 border-white/20 text-white hover:bg-white/10"
                onClick={() => scrollToSection("socials-content")}
                data-testid="scroll-tiktok"
              >
                <SiTiktok className="w-5 h-5" />
                TikTok
              </Button>
            </div>
          </AnimatedSection>
        </div>

        <button 
          onClick={() => scrollToSection("socials-content")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      <section id="socials-content" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
            
            <div className="flex-1 flex flex-col lg:pr-12 lg:border-r lg:border-border">
              <AnimatedSection animation="fade-in-up" className="text-center mb-10">
                <div className="inline-block mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-primary p-1">
                    <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                      <SiInstagram className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Instagram
                </h2>
                
                <p className="font-sans text-lg text-muted-foreground mb-4">
                  {instagramSettings?.username || "@bigbackliving"}
                </p>
                
                <Button 
                  size="default"
                  className="gap-2"
                  onClick={() => handleFollowClick(instagramSettings?.profileUrl)}
                  disabled={!instagramSettings?.profileUrl}
                  data-testid="button-follow-instagram"
                >
                  <ExternalLink className="w-4 h-4" />
                  Follow on Instagram
                </Button>
              </AnimatedSection>

              <div className="flex-1">
                {instagramEmbeds.length > 0 ? (
                  <div className="space-y-6" data-testid="instagram-embeds">
                    {instagramEmbeds.map((embed, index) => (
                      <AnimatedSection 
                        key={embed.id} 
                        animation="fade-in-up" 
                        delay={index * 100}
                        className="flex flex-col items-center"
                        data-testid={`embed-${embed.id}`}
                      >
                        {embed.title && (
                          <p className="text-sm text-muted-foreground mb-3 font-sans">{embed.title}</p>
                        )}
                        <EmbedRenderer embedCode={embed.embedCode} platform={embed.platform} />
                      </AnimatedSection>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-primary/30 flex items-center justify-center mb-4">
                      <SiInstagram className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-sans">No Instagram posts yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:pl-12">
              <AnimatedSection animation="fade-in-up" delay={100} className="text-center mb-10">
                <div className="inline-block mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-primary p-1">
                    <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                      <SiTiktok className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  TikTok
                </h2>
                
                <p className="font-sans text-lg text-muted-foreground mb-4">
                  {tiktokSettings?.username || "@bigbackliving"}
                </p>
                
                <Button 
                  size="default"
                  className="gap-2"
                  onClick={() => handleFollowClick(tiktokSettings?.profileUrl)}
                  disabled={!tiktokSettings?.profileUrl}
                  data-testid="button-follow-tiktok"
                >
                  <ExternalLink className="w-4 h-4" />
                  Follow on TikTok
                </Button>
              </AnimatedSection>

              <div className="flex-1">
                {tiktokEmbeds.length > 0 ? (
                  <div className="space-y-6" data-testid="tiktok-embeds">
                    {tiktokEmbeds.map((embed, index) => (
                      <AnimatedSection 
                        key={embed.id} 
                        animation="fade-in-up" 
                        delay={index * 100}
                        className="flex flex-col items-center"
                        data-testid={`embed-${embed.id}`}
                      >
                        {embed.title && (
                          <p className="text-sm text-muted-foreground mb-3 font-sans">{embed.title}</p>
                        )}
                        <EmbedRenderer embedCode={embed.embedCode} platform={embed.platform} />
                      </AnimatedSection>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-primary/30 flex items-center justify-center mb-4">
                      <SiTiktok className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-sans">No TikTok videos yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-primary" />
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="w-8 h-px bg-primary" />
            </div>
            
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay Connected
            </h3>
            
            <p className="font-sans text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Follow for daily food discoveries, behind-the-scenes content, and exclusive reviews before they hit the blog.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="gap-3"
                onClick={() => handleFollowClick(instagramSettings?.profileUrl)}
                disabled={!instagramSettings?.profileUrl}
              >
                <SiInstagram className="w-5 h-5" />
                Instagram
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="gap-3"
                onClick={() => handleFollowClick(tiktokSettings?.profileUrl)}
                disabled={!tiktokSettings?.profileUrl}
              >
                <SiTiktok className="w-5 h-5" />
                TikTok
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
