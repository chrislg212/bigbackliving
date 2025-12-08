import blurredBg1 from "@assets/stock_images/blurred_warm_golden__41317a8e.jpg";
import blurredBg2 from "@assets/stock_images/soft_neutral_beige_c_bf21efcb.jpg";
import blurredBg3 from "@assets/stock_images/light_subtle_white_g_315b1133.jpg";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  variant?: 1 | 2 | 3;
}

const backgrounds = [blurredBg1, blurredBg2, blurredBg3];

export default function PageHeader({
  title,
  subtitle,
  variant = 1,
}: PageHeaderProps) {
  const bgImage = backgrounds[variant - 1];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

      <section
        className="relative bg-card border-b border-primary/10 overflow-hidden"
        data-testid="page-header"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px) saturate(0.4) brightness(1.05)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="animate-fade-in-up">
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground text-center mb-3"
              data-testid="page-title"
            >
              {title}
            </h1>

            <div className="flex justify-center mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>

            <p className="font-sans text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
