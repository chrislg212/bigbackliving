# Food Review Blog - The Palate

## Overview

The Palate is a premium food review blog inspired by high-end culinary publications like Bon Appétit and The Infatuation. The application provides an editorial-focused platform for publishing restaurant reviews with an emphasis on visual storytelling, typography-forward design, and sophisticated food photography. The project features a comprehensive review system with multiple ranking pages (NYC Eats, Cuisines, Top 10 Lists, College Budget Eats) and a content section for articles, videos, podcasts, and photo essays.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router

**UI Component Strategy**
- Shadcn/ui component library (New York style variant) for pre-built, accessible components
- Radix UI primitives as the foundation for complex interactive components
- Tailwind CSS for utility-first styling with custom design tokens
- Component paths aliased via `@/components`, `@/lib`, `@/hooks` for clean imports

**Design System Implementation**
- Custom color scheme using HSL values with CSS variables for theming support
- Typography system combining Google Fonts (Playfair Display for headings, Inter for body text)
- Responsive breakpoints: mobile-first approach with md (tablet) and lg (desktop) variants
- Custom spacing units following Tailwind's 4px-based scale

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management and caching
- Custom query client configuration with disabled auto-refetching for static content
- Mock data structure in place for development, prepared for API integration

**Form Handling**
- React Hook Form with Zod schema validation via @hookform/resolvers
- Type-safe form validation using drizzle-zod for database schema alignment

### Backend Architecture

**Server Framework**
- Express.js for HTTP server with custom middleware stack
- HTTP server wrapper for potential WebSocket upgrades
- Custom logging middleware tracking request duration and response status

**API Design Pattern**
- RESTful API structure with `/api` prefix for all application routes
- Separation of concerns: routes defined in `server/routes.ts`, static serving in `server/static.ts`
- Storage abstraction layer via `IStorage` interface for database operations

**Storage Layer**
- Interface-based storage design enabling easy swapping between implementations
- Current implementation: In-memory storage (`MemStorage`) for development
- Prepared for PostgreSQL migration using Drizzle ORM

**Development vs Production**
- Development: Vite middleware integration for HMR and on-the-fly compilation
- Production: Pre-built static assets served from `dist/public` directory
- Build process bundles both client (Vite) and server (esbuild) with selective dependency bundling

### Data Architecture

**Database Schema (Drizzle ORM)**
- PostgreSQL as the target database (configured but not yet connected)
- Schema-first approach with TypeScript types derived from Drizzle schemas
- User table structure in place as foundation for authentication
- Zod schemas generated from database schemas for runtime validation

**Data Modeling**
- Review interface defines core content structure: name, cuisine, location, rating, excerpt, images, price range
- Slug-based URL routing for SEO-friendly review pages
- Support for detailed review content with multiple sections (details, highlights, verdict)

**Authentication Preparation**
- User schema with username/password fields
- UUID-based primary keys using PostgreSQL's `gen_random_uuid()`
- Storage interface includes user CRUD operations ready for auth implementation

### External Dependencies

**Third-Party UI Libraries**
- Radix UI: Comprehensive collection of unstyled, accessible component primitives (accordion, dialog, dropdown-menu, popover, tabs, toast, tooltip, etc.)
- cmdk: Command palette component for keyboard-driven navigation
- embla-carousel-react: Touch-friendly carousel/slider functionality
- lucide-react: Icon library for consistent iconography

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

**Session Management (Prepared)**
- express-session: Server-side session middleware
- connect-pg-simple: PostgreSQL session store adapter

**Date Handling**
- date-fns: Modern JavaScript date utility library for formatting and manipulation

**Development Tools**
- tsx: TypeScript execution engine for running server without compilation
- Replit-specific plugins: runtime error overlay, cartographer, dev banner for enhanced development experience

**Build Process**
- esbuild: Fast JavaScript/TypeScript bundler for server code with selective dependency bundling
- Dependency allowlist includes commonly used packages to reduce cold start syscalls in production