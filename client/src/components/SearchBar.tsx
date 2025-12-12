import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, Utensils, List, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getReviews } from "@/lib/staticData";

const cuisinesList = [
  { name: "Italian", href: "/cuisines/italian" },
  { name: "Japanese", href: "/cuisines/japanese" },
  { name: "Korean", href: "/cuisines/korean" },
  { name: "Chinese", href: "/cuisines/chinese" },
  { name: "Mexican", href: "/cuisines/mexican" },
  { name: "French", href: "/cuisines/french" },
  { name: "Thai", href: "/cuisines/thai" },
  { name: "Indian", href: "/cuisines/indian" },
  { name: "American", href: "/cuisines/american" },
  { name: "Mediterranean", href: "/cuisines/mediterranean" },
];

const listsList = [
  { name: "NYC Eats", href: "/rankings/nyc-eats" },
  { name: "Cuisines", href: "/rankings/cuisines" },
  { name: "Featured Guides", href: "/rankings/top-10" },
  { name: "College Budget Eats", href: "/rankings/college-budget" },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dbReviews = getReviews();

  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchQuery = query.toLowerCase().trim();

  const filteredReviews = searchQuery
    ? dbReviews.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery) ||
          r.cuisine.toLowerCase().includes(searchQuery) ||
          r.location.toLowerCase().includes(searchQuery)
      )
    : [];

  const filteredCuisines = searchQuery
    ? cuisinesList.filter((c) => c.name.toLowerCase().includes(searchQuery))
    : [];

  const filteredLists = searchQuery
    ? listsList.filter((l) => l.name.toLowerCase().includes(searchQuery))
    : [];

  const hasResults = filteredReviews.length > 0 || filteredCuisines.length > 0 || filteredLists.length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9 w-40 md:w-56 text-sm bg-muted/50 border-primary/20 focus:border-primary/40"
          data-testid="search-input"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 px-2"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            data-testid="search-clear"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {isOpen && searchQuery && (
        <div
          className="absolute top-full mt-2 left-0 right-0 md:w-80 bg-background border border-primary/20 rounded-md shadow-lg overflow-hidden z-50"
          data-testid="search-results"
        >
          {!hasResults ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {filteredReviews.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-muted/50 border-b border-primary/10">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Utensils className="w-3 h-3" />
                      Restaurants
                    </span>
                  </div>
                  {filteredReviews.slice(0, 5).map((review) => (
                    <Link key={review.id} href={`/review/${review.slug}`}>
                      <div
                        className="px-3 py-2.5 hover-elevate cursor-pointer border-b border-primary/5 last:border-0"
                        onClick={() => setIsOpen(false)}
                        data-testid={`search-result-review-${review.id}`}
                      >
                        <div className="font-sans text-sm font-medium text-foreground">
                          {review.name}
                        </div>
                        <div className="font-sans text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{review.cuisine}</span>
                          <span className="text-primary/40">-</span>
                          <span>{review.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filteredCuisines.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-muted/50 border-b border-primary/10">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Cuisines
                    </span>
                  </div>
                  {filteredCuisines.map((cuisine) => (
                    <Link key={cuisine.name} href={cuisine.href}>
                      <div
                        className="px-3 py-2.5 hover-elevate cursor-pointer border-b border-primary/5 last:border-0"
                        onClick={() => setIsOpen(false)}
                        data-testid={`search-result-cuisine-${cuisine.name.toLowerCase()}`}
                      >
                        <div className="font-sans text-sm font-medium text-foreground">
                          {cuisine.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filteredLists.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-muted/50 border-b border-primary/10">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <List className="w-3 h-3" />
                      Guides
                    </span>
                  </div>
                  {filteredLists.map((list) => (
                    <Link key={list.name} href={list.href}>
                      <div
                        className="px-3 py-2.5 hover-elevate cursor-pointer border-b border-primary/5 last:border-0"
                        onClick={() => setIsOpen(false)}
                        data-testid={`search-result-list-${list.href.split("/").pop()}`}
                      >
                        <div className="font-sans text-sm font-medium text-foreground">
                          {list.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
