# Food Review Blog - Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from premium food and lifestyle blogs (Bon Appétit, Kinfolk, The Infatuation) while maintaining a distinctive editorial voice. Focus on visual storytelling through photography with clean, magazine-quality typography and layouts.

## Core Design Principles
1. **Editorial Excellence**: Typography-forward design with generous whitespace
2. **Food-First**: High-quality food photography takes center stage
3. **Refined Simplicity**: Sophisticated without being cluttered
4. **Scannable Content**: Easy to browse reviews quickly

---

## Typography System

**Primary Font**: Playfair Display (Google Fonts) - Elegant serif for headings
**Secondary Font**: Inter (Google Fonts) - Clean sans-serif for body text

**Hierarchy**:
- Site Title/Logo: Playfair Display, 32px, weight 700
- Hero Headline: Playfair Display, 56px → 72px desktop, weight 600
- Page Headings (H1): Playfair Display, 48px, weight 600
- Section Headings (H2): Playfair Display, 36px, weight 600
- Review Card Titles: Playfair Display, 24px, weight 600
- Body Text: Inter, 16px → 18px desktop, weight 400, line-height 1.7
- Meta Info: Inter, 14px, weight 500, uppercase letter-spacing

---

## Layout System

**Spacing Units**: Tailwind units of 4, 8, 12, 16, 24, 32 (p-4, m-8, gap-12, etc.)

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl centered
- Content areas: max-w-6xl
- Article content: max-w-3xl for optimal reading

**Responsive Breakpoints**:
- Mobile: Single column, stacked content
- Tablet (md:): 2-column review grid
- Desktop (lg:): 3-column review grid for cards

---

## Component Library

### Navigation Bar
- Sticky header with cream background
- Site logo/name left-aligned (Playfair Display)
- Navigation links right-aligned (Home, Reviews, About)
- Thin gold bottom border (1px)
- Clean hover states with gold underline animation
- Height: py-6 with container max-w-7xl

### Hero Section
- Full-width, 80vh height on desktop
- Large hero image with subtle dark overlay for text contrast
- Centered content with headline + tagline
- CTA button with blurred cream background (backdrop-blur)
- Vertical centering of content

### Review Cards
- White/cream card backgrounds with subtle shadow on hover
- Aspect ratio 4:3 food image at top
- Restaurant name (Playfair Display, 24px)
- Rating display: Gold star icons + numeric score
- Cuisine type + location (smaller, grey text)
- Short excerpt (2 lines, truncated)
- "Read Review" link in gold
- Smooth shadow elevation on hover
- Grid: 1 column mobile → 2 columns tablet → 3 columns desktop

### Individual Review Template
- Full-width hero image (40vh) with restaurant name overlay
- Content in max-w-3xl container
- Rating and key info section: 2-column grid (rating, cuisine, price range, location)
- Photo gallery: 2-column masonry grid of food photos
- Typography-rich review content with generous line-height
- Gold accent dividers between sections
- Related reviews section at bottom (3-column grid of cards)

### Footer
- Cream background with gold top border
- 3-column layout: About snippet, Quick Links, Social/Contact
- Copyright and credits centered below
- Generous padding (py-16)

---

## Images

**Hero Section** (Homepage):
- Large, high-quality lifestyle food photography
- Suggested: Elegant table setting with beautiful plated dish, soft natural lighting
- Dimension: 1920x1080px minimum
- Treatment: Subtle dark gradient overlay (30% opacity) for text readability

**Review Cards** (Homepage & Reviews Page):
- Each card needs a signature dish photo from the restaurant
- Dimension: 800x600px (4:3 ratio)
- Treatment: None, clean crisp images

**Individual Review Pages**:
- Hero image: Restaurant exterior or signature dish, 1920x720px
- Gallery images: 4-6 food photos showing different dishes, 800x800px
- Treatment: Clean presentation, no overlays on gallery

**About Page**:
- Optional author photo or workspace shot, 600x600px

---

## Interactions & States

**Minimal Animations**:
- Card hover: Subtle shadow elevation (150ms ease)
- Navigation links: Gold underline slide-in (200ms)
- Buttons: Slight scale (0.98) on active state
- Page transitions: None (instant load preferred for content)

**Focus States**:
- Gold outline (2px) for keyboard navigation
- Maintain high contrast for accessibility

---

## Special Features

**Star Rating System**:
- 5-star display using gold star icons (filled/outlined)
- Include numeric score (e.g., "4.5 / 5")
- Prominent placement in cards and review headers

**Simple Content Management**:
- Reviews stored as individual HTML files (review-restaurant-name.html)
- Index page includes review cards manually
- Review template provides consistent structure for copy-paste workflow

---

## Page-Specific Layouts

**Homepage**:
1. Hero section (80vh) with main headline
2. Recent Reviews section: "Latest Discoveries" heading + 6-card grid
3. Brief CTA section: "Have a recommendation?" with simple contact button

**Reviews Page**:
1. Page header with title "All Reviews"
2. Full review grid (9-12 cards, 3 columns desktop)
3. Simple pagination if needed

**About Page**:
1. Header section with page title
2. 2-column layout: Author bio + photo
3. Mission statement section
4. Contact information

This design creates a sophisticated, editorial food blog that prioritizes beautiful photography and readable content while maintaining the cream, black, and gold color identity throughout.