interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  animateImage?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  backgroundImage,
  animateImage = true,
}: PageHeaderProps) {

  return (
    <section
      className="border-b border-primary/10 overflow-hidden"
      data-testid="page-header"
    >
      <div className="grid md:grid-cols-2">
        {backgroundImage && (
          <div className="relative h-48 md:h-auto md:min-h-[400px] order-1 md:order-2">
            <img 
              src={backgroundImage} 
              alt="Washington Square Park"  // Descriptive alt text for accessibility
              className={`absolute inset-0 w-full h-full object-cover object-center ${animateImage ? 'animate-fade-in-up' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
          </div>
        )}

        <div className={`bg-background relative order-2 md:order-1 ${!backgroundImage ? 'md:col-span-2' : ''}`}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className={`relative px-6 lg:px-12 py-16 md:py-20 ${backgroundImage ? 'max-w-xl mx-auto md:ml-auto md:mr-0' : 'max-w-4xl mx-auto text-center'}`}>
            <div className="animate-fade-in-up">
              <h1
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4"
                data-testid="page-title"
              >
                {title}
              </h1>

              <div className={`w-16 h-0.5 bg-gradient-to-r from-primary to-transparent mb-6 ${!backgroundImage ? 'mx-auto' : ''}`} />

              <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
