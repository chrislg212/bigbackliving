import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { GalleryImage } from "@shared/schema";

interface PhotoGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export default function PhotoGallery({ images, title = "Photos" }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      duration: 30,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <>
      <div className="space-y-6" data-testid="photo-gallery">
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {title}
          </h2>
        </div>

        <div className="relative group">
          <div className="overflow-hidden rounded-md" ref={emblaRef}>
            <div className="flex">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-[0_0_80%] md:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0 pl-4 first:pl-0"
                >
                  <button
                    onClick={() => openLightbox(index)}
                    className="group/img relative aspect-[4/3] w-full rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    data-testid={`gallery-image-${index}`}
                  >
                    <img
                      src={image.url}
                      alt={image.caption || `Gallery photo ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300" />
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                        <p className="font-sans text-xs text-white line-clamp-2">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm border-primary/20 hover:bg-background shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={scrollPrev}
                data-testid="carousel-prev"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm border-primary/20 hover:bg-background shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={scrollNext}
                data-testid="carousel-next"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          data-testid="lightbox-modal"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 z-10"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            data-testid="lightbox-close"
          >
            <X className="w-6 h-6" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                data-testid="lightbox-prev"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                data-testid="lightbox-next"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].caption || `Gallery photo ${currentIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain mx-auto rounded-md"
              data-testid="lightbox-image"
            />
            {images[currentIndex].caption && (
              <p className="font-sans text-center text-white/90 mt-4 text-sm md:text-base">
                {images[currentIndex].caption}
              </p>
            )}
            <p className="font-sans text-center text-white/50 mt-2 text-xs">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
