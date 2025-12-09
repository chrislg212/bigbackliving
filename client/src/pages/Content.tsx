import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { Play, Music, ExternalLink, Loader2 } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import foodPhotographyImage from "@assets/stock_images/food_photography_soc_438b2452.jpg";
import type { SocialSettings, SocialEmbed } from "@shared/schema";

type Platform = "instagram" | "tiktok";

interface SocialPost {
  id: string;
  image: string;
  caption: string;
  date: string;
}

const mockInstagramPosts: SocialPost[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    caption: "The perfect bite exists, and we found it at La Bella Italia.",
    date: "2 days ago",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    caption: "When the steak is aged 45 days, you know it's going to be exceptional.",
    date: "4 days ago",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    caption: "Omakase dreams at Sakura. Each piece tells a story.",
    date: "1 week ago",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    caption: "Wood-fired perfection. The char, the cheese, the char again.",
    date: "1 week ago",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
    caption: "Dessert is never optional. Especially at Maison du Chocolat.",
    date: "2 weeks ago",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400",
    caption: "Paella for the soul. El Mar Azul delivers.",
    date: "2 weeks ago",
  },
];

const mockTikTokPosts: SocialPost[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400",
    caption: "POV: You found the best hidden restaurant in NYC",
    date: "3 days ago",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    caption: "This $15 meal tastes like $150. Not clickbait.",
    date: "5 days ago",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    caption: "Rating every dish at the most expensive restaurant in Manhattan",
    date: "1 week ago",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    caption: "Chef's reaction when I asked for ketchup at a steakhouse",
    date: "1 week ago",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
    caption: "I ate my way through Little Italy so you don't have to",
    date: "2 weeks ago",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
    caption: "The sushi chef has been doing this for 40 years. Watch this.",
    date: "2 weeks ago",
  },
];

function InstagramCard({ post, index }: { post: SocialPost; index: number }) {
  return (
    <div
      className={`group relative aspect-square rounded-md overflow-hidden cursor-pointer card-hover-lift opacity-0 animate-fade-in-up stagger-${index + 1}`}
    >
      <img
        src={post.image}
        alt={post.caption}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="font-sans text-sm text-white line-clamp-2">{post.caption}</p>
      </div>
    </div>
  );
}

function TikTokCard({ post, index }: { post: SocialPost; index: number }) {
  return (
    <div
      className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer card-hover-lift opacity-0 animate-fade-in-up stagger-${index + 1}`}
    >
      <img
        src={post.image}
        alt={post.caption}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <SiTiktok className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-sans text-xs text-white/80">{post.date}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-4 p-4">
        <p className="font-sans text-sm text-white font-medium mb-2 line-clamp-2">{post.caption}</p>
        <div className="flex items-center gap-2">
          <Music className="w-3 h-3 text-white/60" />
          <span className="font-sans text-xs text-white/60">Original Sound - The Palate</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>
    </div>
  );
}

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
        backgroundImage={foodPhotographyImage}
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

            {platformEmbeds.length > 0 && (
              <div className="space-y-6" data-testid="instagram-embeds">
                <h4 className="font-serif text-lg font-semibold text-foreground">Featured Posts</h4>
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
            )}

            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
              data-testid="instagram-grid"
            >
              {mockInstagramPosts.map((post, index) => (
                <InstagramCard key={post.id} post={post} index={index} />
              ))}
            </div>
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

            {platformEmbeds.length > 0 && (
              <div className="space-y-6" data-testid="tiktok-embeds">
                <h4 className="font-serif text-lg font-semibold text-foreground">Featured Videos</h4>
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
            )}

            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
              data-testid="tiktok-grid"
            >
              {mockTikTokPosts.map((post, index) => (
                <TikTokCard key={post.id} post={post} index={index} />
              ))}
            </div>
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
