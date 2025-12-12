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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || foodPhotographyImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/95" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm tracking-[0.3em] uppercase text-white/80">
                Behind the Scenes
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
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
                className="gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0"
                onClick={() => scrollToSection("instagram-section")}
                data-testid="scroll-instagram"
              >
                <SiInstagram className="w-5 h-5" />
                Instagram
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="gap-3 bg-black/50 border-white/20 text-white hover:bg-white/10"
                onClick={() => scrollToSection("tiktok-section")}
                data-testid="scroll-tiktok"
              >
                <SiTiktok className="w-5 h-5" />
                TikTok
              </Button>
            </div>
          </AnimatedSection>
        </div>

        <button 
          onClick={() => scrollToSection("instagram-section")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      <section 
        id="instagram-section" 
        className="relative min-h-screen py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/20" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <div className="inline-block mb-8">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 p-1 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                  <SiInstagram className="w-12 h-12 text-foreground" />
                </div>
              </div>
            </div>
            
            <span className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              The Visual Feed
            </span>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Instagram
            </h2>
            
            <p className="font-sans text-xl text-muted-foreground mb-6">
              {instagramSettings?.username || "@bigbackliving"}
            </p>
            
            <Button 
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0"
              onClick={() => handleFollowClick(instagramSettings?.profileUrl)}
              disabled={!instagramSettings?.profileUrl}
              data-testid="button-follow-instagram"
            >
              <ExternalLink className="w-4 h-4" />
              Follow on Instagram
            </Button>
          </AnimatedSection>

          {instagramEmbeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="instagram-embeds">
              {instagramEmbeds.map((embed, index) => (
                <AnimatedSection 
                  key={embed.id} 
                  animation="scale-in" 
                  delay={index * 100}
                  className="flex flex-col items-center"
                  data-testid={`embed-${embed.id}`}
                >
                  {embed.title && (
                    <p className="text-sm text-muted-foreground mb-3 font-sans">{embed.title}</p>
                  )}
                  <div className="transform hover:scale-[1.02] transition-transform duration-300">
                    <EmbedRenderer embedCode={embed.embedCode} platform={embed.platform} />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection animation="fade-in" className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-orange-500/20 flex items-center justify-center mb-6">
                <SiInstagram className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-sans">No Instagram posts yet. Add embeds in the admin panel.</p>
            </AnimatedSection>
          )}
        </div>

        <button 
          onClick={() => scrollToSection("tiktok-section")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
          aria-label="Scroll to TikTok"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      <section 
        id="tiktok-section" 
        className="relative min-h-screen py-20 overflow-hidden bg-foreground/[0.02]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-background to-pink-900/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <div className="inline-block mb-8">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-foreground p-1 -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                  <SiTiktok className="w-12 h-12 text-foreground" />
                </div>
              </div>
            </div>
            
            <span className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              Short Form Content
            </span>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              TikTok
            </h2>
            
            <p className="font-sans text-xl text-muted-foreground mb-6">
              {tiktokSettings?.username || "@bigbackliving"}
            </p>
            
            <Button 
              size="lg"
              variant="default"
              className="gap-2"
              onClick={() => handleFollowClick(tiktokSettings?.profileUrl)}
              disabled={!tiktokSettings?.profileUrl}
              data-testid="button-follow-tiktok"
            >
              <ExternalLink className="w-4 h-4" />
              Follow on TikTok
            </Button>
          </AnimatedSection>

          {tiktokEmbeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="tiktok-embeds">
              {tiktokEmbeds.map((embed, index) => (
                <AnimatedSection 
                  key={embed.id} 
                  animation="scale-in" 
                  delay={index * 100}
                  className="flex flex-col items-center"
                  data-testid={`embed-${embed.id}`}
                >
                  {embed.title && (
                    <p className="text-sm text-muted-foreground mb-3 font-sans">{embed.title}</p>
                  )}
                  <div className="transform hover:scale-[1.02] transition-transform duration-300">
                    <EmbedRenderer embedCode={embed.embedCode} platform={embed.platform} />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection animation="fade-in" className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-foreground/10 flex items-center justify-center mb-6">
                <SiTiktok className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-sans">No TikTok videos yet. Add embeds in the admin panel.</p>
            </AnimatedSection>
          )}
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary" />
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
                className="gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0"
                onClick={() => handleFollowClick(instagramSettings?.profileUrl)}
                disabled={!instagramSettings?.profileUrl}
              >
                <SiInstagram className="w-5 h-5" />
                Instagram
              </Button>
              <Button 
                size="lg"
                variant="default"
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
