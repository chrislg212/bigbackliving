import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/hero_fine_dining_scene.png";

interface HeroProps {
  customImage?: string;
}

export default function Hero({ customImage }: HeroProps) {
  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${customImage || heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight text-[#fffefc]"
          data-testid="hero-title"
        >Christopher's Restaurant Reviews</h1>
        <p
          className="font-sans text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          data-testid="hero-subtitle"
        >
          Honest reviews of the finest restaurants, from hidden gems to
          celebrated institutions. Your guide to exceptional dining experiences.
        </p>
        <Link href="/reviews">
          <Button
            size="lg"
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 font-sans uppercase tracking-wider"
            data-testid="hero-cta"
          >MY Reviews</Button>
        </Link>
      </div>
    </section>
  );
}
