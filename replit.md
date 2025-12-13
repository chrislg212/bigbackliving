# Food Review Blog - Bigbackliving

## Overview

Bigbackliving is a premium food review blog with cream, black, and gold (#C59D5F) branding. The application provides an editorial-focused platform for publishing restaurant reviews from a first-person perspective with an emphasis on visual storytelling, typography-forward design, and sophisticated food photography. The project features a comprehensive review system with multiple category pages (Locations, Cuisines, Featured Guides, College Budget Eats) and a content section for social media links. Built as a static site - all data and images are bundled at build time with no backend server required for production.

## User Preferences

Preferred communication style: Simple, everyday language.

## Multi-Region Location System

The site supports multiple geographic regions for restaurant reviews:
- **New York City** (slug: `nyc`) - /location/nyc
- **DMV Area** (slug: `dmv`) - /location/dmv  
- **Europe** (slug: `europe`) - /location/europe

Navigation uses a "Locations" link in the header that leads to region pages. Each region displays its restaurants organized by location categories (neighborhoods/areas).

Database tables:
- `regions`: id, name, slug, description, image (stores geographic regions)
- `location_categories`: id, regionId, name, slug, description, image (neighborhood/area categories within regions)
- `reviews_location_categories`: reviewId, locationCategoryId (many-to-many relationship)

## Routing Structure

All main category pages use `/categories/` prefix:
- `/categories/locations` - Locations listing page
- `/categories/cuisines` - Cuisines listing page
- `/categories/featured-guides` - Featured Guides listing page
- `/categories/college-budget` - College Budget Eats listing page
- `/cuisines/:cuisine` - Individual cuisine reviews
- `/featured-guides/:slug` - Individual featured guide detail page
- `/location/:regionSlug` - Individual region's restaurants

## Recent Changes (Latest Session)

### Review-Location Categories Feature
- **Admin Panel**: Added location category multi-select to review form with checkboxes grouped by region
- **API Endpoints**: GET/PUT `/api/reviews/:id/location-categories` for managing review-location associations
- **Storage Layer**: Added methods getReviewLocationCategories, setReviewLocationCategories, getReviewsByLocationCategory
- Reviews can now be assigned to multiple location categories (neighborhoods/areas) within regions

### Previous Session: Route & Naming Restructuring
- **Folder migration**: Renamed `client/src/pages/rankings/` → `client/src/pages/categories/`
- **Route prefix change**: All routes changed from `/rankings/*` to `/categories/*`
- **Component renames**: 
  - Top10Lists.tsx → FeaturedGuidesList.tsx
  - Top10Detail.tsx → FeaturedGuideDetail.tsx
- **Admin panel updates**: Removed NYC Eats tab (6 tabs total now: Reviews, Cuisines, Featured Guides, Socials, Headers, Messages)
- **Navigation renames**: "Top 10" → "Featured Guides" throughout app
- **Content section rename**: "Content" → "Socials" across navigation and admin panel

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router
- Static site generation: all data bundled at build time via `static-data.json`

**UI Component Strategy**
- Shadcn/ui component library (New York style variant) for pre-built, accessible components
- Radix UI primitives as the foundation for complex interactive components
- Tailwind CSS for utility-first styling with custom design tokens
- Component paths aliased via `@/components`, `@/lib`, `@/hooks` for clean imports

**Design System Implementation**
- Custom color scheme using HSL values with CSS variables for theming support
- Primary brand color: Gold (#C59D5F) with cream and black accents
- Typography system combining Google Fonts (Playfair Display for headings, Inter for body text)
- Responsive breakpoints: mobile-first approach with md (tablet) and lg (desktop) variants
- Custom spacing units following Tailwind's 4px-based scale

**State Management & Data Fetching**
- TanStack Query (React Query) for client-side caching of static data
- Custom query client configuration with disabled auto-refetching for static content
- Static data loaded from `client/src/data/static-data.json` at build time
- No runtime API calls in production - all data pre-bundled

**Form Handling**
- React Hook Form with Zod schema validation via @hookform/resolvers
- Type-safe form validation using drizzle-zod for database schema alignment

### Backend Architecture (Admin Only)

**Server Framework**
- Express.js for HTTP server with custom middleware stack
- HTTP server wrapper for potential WebSocket upgrades
- Custom logging middleware tracking request duration and response status
- Development-only server; production uses static HTML/CSS/JS

**API Design Pattern**
- RESTful API structure with `/api` prefix for admin panel routes
- Admin panel communicates with backend to save edits
- "Refresh Static Data" workflow: Admin edits → database update → static JSON generation → rebuild

**Storage Layer**
- PostgreSQL database for admin data persistence (reviews, cuisines, featured guides, regions, location categories, page headers, contact submissions)
- Drizzle ORM for type-safe database queries
- Object storage service for image uploads via Replit App Storage
- Static data exported to `static-data.json` for build-time bundling

**Development vs Production**
- Development: Vite middleware integration for HMR and on-the-fly compilation, Express server for admin API
- Production: Pre-built static assets served from `dist/public` directory, no server required
- Build process: bundles Vite frontend with static data, no backend server in production

### Data Architecture

**Database Schema (Drizzle ORM)**
- PostgreSQL database for admin data storage
- Reviews table: id, slug, name, cuisine, location, rating, excerpt, image, priceRange, fullReview, highlights, atmosphere, mustTry, visitDate
- Cuisines table: id, name, slug, description, image
- FeaturedGuides table: id, name, slug, description, image
- Regions table: id, name, slug, description, image
- LocationCategories table: id, regionId, name, slug, description, image
- ReviewsLocationCategories table: reviewId, locationCategoryId (many-to-many)
- Page Headers table: id, pageSlug, title, subtitle, image (for custom page header images)
- ContactSubmissions table: id, name, email, message, createdAt, read
- Zod schemas generated from database schemas for runtime validation

**Admin Panel System**
- 6 tabs: Reviews, Cuisines, Featured Guides, Socials, Page Headers, Messages
- Each tab allows CRUD operations that update the database
- "Refresh Static Data" button exports all data to `static-data.json`
- Changes are committed and built for production deployment

**Page Headers System**
- Custom uploadable header images for 8 pages: Home, About, Socials, Reviews, Locations, Cuisines, Featured Guides, College Budget
- usePageHeader hook fetches all headers and finds by slug to avoid 404 errors
- Admin panel includes Page Headers tab for managing images
- Pages fallback to default generated images when no custom header exists

**Contact Form System**
- ContactFormModal component on About page for visitor messages
- Form fields: name, email, message with Zod validation
- Database table: contact_submissions (id, name, email, message, createdAt, read)
- Admin panel Messages tab shows all submissions ordered by newest first
- Mark as read functionality and delete option for submissions

**Data Modeling**
- Review interface defines core content structure: name, cuisine, location, rating, excerpt, images, price range, detailed review text
- Slug-based URL routing for SEO-friendly review pages
- Support for detailed review content with multiple sections (details, highlights, verdict)
- First-person narrative language for all review descriptions

**Static Data Export**
- `static-data.json` contains all non-admin content: reviews, cuisines, regions, location categories, featured guides, socials settings, page headers
- Generated after admin edits via "Refresh Static Data" workflow
- Bundled with frontend at build time for static deployment

### External Dependencies

**Third-Party UI Libraries**
- Radix UI: Comprehensive collection of unstyled, accessible component primitives (accordion, dialog, dropdown-menu, popover, tabs, toast, tooltip, etc.)
- cmdk: Command palette component for keyboard-driven navigation
- embla-carousel-react: Touch-friendly carousel/slider functionality
- lucide-react: Icon library for consistent iconography
- @uppy/react: File upload component for image management

**Styling & Design Tools**
- Tailwind CSS: Utility-first CSS framework with custom configuration
- class-variance-authority (CVA): Utility for creating variant-based component APIs
- clsx & tailwind-merge: Class name management and conflict resolution

**Form & Validation**
- React Hook Form: Performant form management with minimal re-renders
- Zod: TypeScript-first schema validation library
- @hookform/resolvers: Integration bridge between React Hook Form and Zod

**Database & ORM**
- Drizzle ORM: TypeScript ORM for PostgreSQL with type-safe query building
- drizzle-kit: CLI tool for schema migrations and database management
- pg: PostgreSQL client driver

**Session Management (Admin)**
- express-session: Server-side session middleware for admin authentication
- connect-pg-simple: PostgreSQL session store adapter
- passport, passport-local: Authentication middleware

**Date Handling**
- date-fns: Modern JavaScript date utility library for formatting and manipulation

**File Upload & Storage**
- @google-cloud/storage: Google Cloud Storage client for image uploads
- @uppy/aws-s3, @uppy/core, @uppy/dashboard: File upload UI and management

**Development Tools**
- tsx: TypeScript execution engine for running server without compilation
- Replit-specific plugins: runtime error overlay, cartographer, dev banner for enhanced development experience

**Build Process**
- esbuild: Fast JavaScript/TypeScript bundler for server code with selective dependency bundling
- Dependency allowlist includes commonly used packages to reduce cold start syscalls in production

## Branding & Contact

- **Brand Name**: Bigbackliving
- **Email**: bigbackliving@gmail.com
- **Primary Brand Color**: Gold (#C59D5F)
- **Color Scheme**: Cream, Black, Gold
- **Writing Style**: First-person formal narrative for all reviews and descriptions
