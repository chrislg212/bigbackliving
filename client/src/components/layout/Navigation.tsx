import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/reviews", label: "Reviews" },
];

const rankingsLinks = [
  { href: "/rankings/nyc-eats", label: "NYC Eats" },
  { href: "/rankings/cuisines", label: "Cuisines" },
  { href: "/rankings/top-10", label: "Top 10 Lists" },
  { href: "/rankings/college-budget", label: "College Budget Eats (Under $20)" },
];

const afterRankingsLinks = [
  { href: "/content", label: "Content" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRankingsActive = location.startsWith("/rankings");

  return (
    <header
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary/20"
      data-testid="navigation"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" data-testid="logo-link">
            <span className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight cursor-pointer">
              The Palate
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative font-sans text-sm font-medium tracking-wide uppercase cursor-pointer transition-colors ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {location === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                  )}
                </span>
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative font-sans text-sm font-medium tracking-wide uppercase cursor-pointer transition-colors flex items-center gap-1 ${
                    isRankingsActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  data-testid="nav-rankings"
                >
                  Rankings
                  <ChevronDown className="w-3 h-3" />
                  {isRankingsActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {rankingsLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>
                      <span
                        className={`w-full cursor-pointer ${
                          location === link.href ? "text-primary" : ""
                        }`}
                        data-testid={`nav-rankings-${link.href.split("/").pop()}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {afterRankingsLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative font-sans text-sm font-medium tracking-wide uppercase cursor-pointer transition-colors ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {location === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                  )}
                </span>
              </Link>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4" data-testid="mobile-menu">
            <div className="flex flex-col gap-1">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block py-2 px-3 rounded-md font-sans text-sm font-medium uppercase cursor-pointer ${
                      location === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              <div className="py-2 px-3">
                <span className="font-sans text-xs font-medium uppercase text-muted-foreground tracking-wider">
                  Rankings
                </span>
              </div>
              {rankingsLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block py-2 px-3 pl-6 rounded-md font-sans text-sm cursor-pointer ${
                      location === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-rankings-${link.href.split("/").pop()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              {afterRankingsLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block py-2 px-3 rounded-md font-sans text-sm font-medium uppercase cursor-pointer ${
                      location === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
