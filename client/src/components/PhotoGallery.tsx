import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@shared/schema";

interface PhotoGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export default function PhotoGallery({ images, title = "Photos" }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const duplicatedImages = [...images, ...images, ...images];

  const openLightbox = (index: number) => {
    const actualIndex = index % images.length;
    setCurrentIndex(actualIndex);
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

        <div className="relative overflow-hidden rounded-md">
          <div 
            className="flex gap-4"
            style={{
              animation: `scroll ${images.length * 5}s linear infinite`,
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px]"
              >
                <button
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[4/3] w-full rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  data-testid={`gallery-image-${index}`}
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${(index % images.length) + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {image.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${images.length} * (280px + 1rem)));
          }
        }
        @media (min-width: 768px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-${images.length} * (320px + 1rem)));
            }
          }
        }
        @media (min-width: 1024px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-${images.length} * (360px + 1rem)));
            }
          }
        }
      `}</style>

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
