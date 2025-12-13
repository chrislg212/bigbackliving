import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Utensils } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/SearchBar";
import { SiInstagram, SiFacebook, SiTiktok } from "react-icons/si";
import { getSocialSettings } from "@/lib/staticData";

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/reviews", label: "Reviews" },
];

const categoriesLinks = [
  { href: "/categories/locations", label: "Locations" },
  { href: "/categories/cuisines", label: "Cuisines" },
  { href: "/categories/featured-guides", label: "Featured Guides" },
];

const afterListsLinks = [
  { href: "/social", label: "Socials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link href={href}>
      <span
        className={`group relative font-sans text-sm font-medium tracking-wide uppercase cursor-pointer transition-all duration-200 py-1 ${
          isActive ? "text-primary" : "text-foreground hover:text-primary"
        }`}
        data-testid={`nav-${label.toLowerCase()}`}
      >
        {label}
        <span 
          className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 transition-all duration-300 ease-out ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`} 
        />
      </span>
    </Link>
  );
}

const platformIcons: Record<string, typeof SiInstagram> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
};

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const socialSettings = getSocialSettings();

  const isCategoriesActive = location.startsWith("/location") || location.startsWith("/categories") || location.startsWith("/cuisines") || location.startsWith("/featured-guides");

  return (
    <header
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary/20"
      data-testid="navigation"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4 -ml-2">
            <Link href="/" data-testid="logo-link">
              <span className="font-serif md:text-3xl text-foreground tracking-tight cursor-pointer hover:text-primary transition-colors duration-300 text-[27px] font-normal">bigbackliving</span>
            </Link>
            <div className="flex items-center gap-2">
              {socialSettings.map((social) => {
                const Icon = platformIcons[social.platform.toLowerCase()];
                if (!Icon) return null;
                return (
                  <a
                    key={social.platform}
                    href={social.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    data-testid={`social-${social.platform.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
              <a
                href="https://beliapp.co/app/chrislg212"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="social-beli"
              >
                <Utensils className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <SearchBar />
            {mainNavLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                label={link.label}
                isActive={location === link.href}
              />
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`group relative font-sans text-sm font-medium tracking-wide uppercase cursor-pointer transition-all duration-200 flex items-center gap-1.5 py-1 ${
                    isCategoriesActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  data-testid="nav-categories"
                >
                  Categories
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  <span 
                    className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 transition-all duration-300 ease-out ${
                      isCategoriesActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} 
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 p-1.5 animate-fade-in-down">
                {categoriesLinks.map((link, index) => (
                  <DropdownMenuItem
                    key={link.href}
                    asChild
                    className={`px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 opacity-0 animate-fade-in-up stagger-${index + 1}`}
                  >
                    <Link href={link.href}>
                      <span
                        className={`w-full font-sans text-sm ${
                          location === link.href || 
                          (link.href === '/categories/locations' && location.startsWith('/location/')) ||
                          location.startsWith(link.href.replace('/categories/', '/')) 
                            ? "text-primary font-medium" : ""
                        }`}
                        data-testid={`nav-category-${link.href.split("/").pop()}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {afterListsLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                label={link.label}
                isActive={location === link.href}
              />
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
          <div className="md:hidden pb-4 animate-fade-in-down" data-testid="mobile-menu">
            <div className="flex flex-col gap-1">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block py-2.5 px-3 rounded-md font-sans text-sm font-medium uppercase cursor-pointer transition-colors duration-150 ${
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

              <div className="py-2.5 px-3 mt-1">
                <span className="font-sans text-xs font-medium uppercase text-muted-foreground tracking-wider">
                  Categories
                </span>
              </div>
              {categoriesLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block py-2.5 px-3 pl-6 rounded-md font-sans text-sm cursor-pointer transition-colors duration-150 ${
                      location === link.href || 
                      (link.href === '/categories/locations' && location.startsWith('/location/')) ||
                      location.startsWith(link.href.replace('/categories/', '/'))
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-category-${link.href.split("/").pop()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              {afterListsLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block py-2.5 px-3 rounded-md font-sans text-sm font-medium uppercase cursor-pointer transition-colors duration-150 mt-1 ${
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

              <div className="pt-4 px-3" data-testid="mobile-search">
                <SearchBar fullWidth />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
