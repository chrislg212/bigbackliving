import { Link } from "wouter";

export default function Footer() {
  return (
    <footer
      className="bg-card border-t border-primary/20 mt-auto"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <Link href="/">
              <span className="font-serif text-2xl font-bold text-foreground cursor-pointer">bigbackliving</span>
            </Link>
            <p className="mt-4 font-sans text-sm text-muted-foreground leading-relaxed">
              Your trusted guide to exceptional dining experiences. Honest
              reviews, beautiful photography, and a passion for culinary
              excellence.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <span
                  className="font-sans text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  data-testid="footer-link-home"
                >
                  Home
                </span>
              </Link>
              <Link href="/reviews">
                <span
                  className="font-sans text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  data-testid="footer-link-reviews"
                >
                  All Reviews
                </span>
              </Link>
              <Link href="/about">
                <span
                  className="font-sans text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  data-testid="footer-link-about"
                >
                  About
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">
              Get in Touch
            </h4>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Have a restaurant recommendation or want to collaborate?
            </p>
            <a
              href="mailto:hello@thepalate.com"
              className="inline-block mt-2 font-sans text-sm text-primary hover:underline"
              data-testid="footer-email"
            >bigbackliving@gmail.com</a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p
            className="text-center font-sans text-xs text-muted-foreground"
            data-testid="footer-copyright"
          >
            &copy; {new Date().getFullYear()} bigbackliving. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
