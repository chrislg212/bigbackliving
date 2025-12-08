import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fade-in" | "fade-in-up" | "fade-in-left" | "fade-in-right" | "scale-in" | "slide-up";
  delay?: number;
  className?: string;
  threshold?: number;
}

const animationClasses = {
  "fade-in": "animate-fade-in",
  "fade-in-up": "animate-fade-in-up",
  "fade-in-left": "animate-fade-in-left",
  "fade-in-right": "animate-fade-in-right",
  "scale-in": "animate-scale-in",
  "slide-up": "animate-slide-up",
};

export default function AnimatedSection({
  children,
  animation = "fade-in-up",
  delay = 0,
  className = "",
  threshold = 0.1,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClasses[animation] : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface AnimatedGridProps {
  children: ReactNode[];
  animation?: "fade-in" | "fade-in-up" | "scale-in";
  staggerDelay?: number;
  className?: string;
}

export function AnimatedGrid({
  children,
  animation = "fade-in-up",
  staggerDelay = 100,
  className = "",
}: AnimatedGridProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`${isVisible ? animationClasses[animation] : "opacity-0"}`}
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
