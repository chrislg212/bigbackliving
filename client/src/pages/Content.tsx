import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import { Heart, MessageCircle, Share2, Bookmark, Play, Music, ExternalLink } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import foodPhotographyImage from "@assets/stock_images/food_photography_soc_438b2452.jpg";

type Platform = "instagram" | "tiktok";

interface SocialPost {
  id: string;
  image: string;
  likes: string;
  comments: string;
  caption: string;
  date: string;
}

const mockInstagramPosts: SocialPost[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    likes: "2.4K",
    comments: "89",
    caption: "The perfect bite exists, and we found it at La Bella Italia.",
    date: "2 days ago",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    likes: "3.1K",
    comments: "124",
    caption: "When the steak is aged 45 days, you know it's going to be exceptional.",
    date: "4 days ago",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    likes: "5.2K",
    comments: "201",
    caption: "Omakase dreams at Sakura. Each piece tells a story.",
    date: "1 week ago",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    likes: "1.8K",
    comments: "67",
    caption: "Wood-fired perfection. The char, the cheese, the char again.",
    date: "1 week ago",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
    likes: "4.7K",
    comments: "156",
    caption: "Dessert is never optional. Especially at Maison du Chocolat.",
    date: "2 weeks ago",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400",
    likes: "2.9K",
    comments: "93",
    caption: "Paella for the soul. El Mar Azul delivers.",
    date: "2 weeks ago",
  },
];

const mockTikTokPosts: SocialPost[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400",
    likes: "45.2K",
    comments: "892",
    caption: "POV: You found the best hidden restaurant in NYC",
    date: "3 days ago",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    likes: "78.1K",
    comments: "1.2K",
    caption: "This $15 meal tastes like $150. Not clickbait.",
    date: "5 days ago",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    likes: "23.4K",
    comments: "445",
    caption: "Rating every dish at the most expensive restaurant in Manhattan",
    date: "1 week ago",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    likes: "112K",
    comments: "2.3K",
    caption: "Chef's reaction when I asked for ketchup at a steakhouse",
    date: "1 week ago",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
    likes: "56.7K",
    comments: "789",
    caption: "I ate my way through Little Italy so you don't have to",
    date: "2 weeks ago",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
    likes: "89.3K",
    comments: "1.5K",
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
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            <span className="font-sans font-medium">{post.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-sans font-medium">{post.comments}</span>
          </div>
        </div>
      </div>
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

      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-primary transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans text-xs text-white mt-1">{post.likes}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans text-xs text-white mt-1">{post.comments}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-white" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-16 p-4">
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

export default function Content() {
  const [activePlatform, setActivePlatform] = useState<Platform>("instagram");

  return (
    <div className="min-h-screen" data-testid="content-page">
      <PageHeader
        title="Follow The Palate"
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
            <AnimatedSection animation="fade-in" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-amber-400 to-primary p-0.5">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <SiInstagram className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">@bigbackchrisnyc</h3>
                  <p className="font-sans text-sm text-muted-foreground">12.4K followers</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2 btn-hover-lift">
                <ExternalLink className="w-4 h-4" />
                Follow
              </Button>
            </AnimatedSection>

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
            <AnimatedSection animation="fade-in" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center">
                  <SiTiktok className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">@thepalate</h3>
                  <p className="font-sans text-sm text-muted-foreground">89.2K followers</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2 btn-hover-lift">
                <ExternalLink className="w-4 h-4" />
                Follow
              </Button>
            </AnimatedSection>

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
            <Button variant="outline" className="gap-2 btn-hover-lift">
              <SiInstagram className="w-4 h-4" />
              Instagram
            </Button>
            <Button variant="outline" className="gap-2 btn-hover-lift">
              <SiTiktok className="w-4 h-4" />
              TikTok
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
