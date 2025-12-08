interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backgroundImage,
}: PageHeaderProps) {

  return (
    <section
      className="relative bg-card border-b border-primary/10 overflow-hidden"
      data-testid="page-header"
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(25px) saturate(0.3) brightness(1.1)",
          }}
        />
      )}

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
  );
}
