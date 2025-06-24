# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint checks

### Testing
No test framework is currently configured. Consider adding Jest or Vitest for unit testing.

### Password Hashing
- `node scripts/hashPassword.js <password>` - Generate bcrypt hash for admin passwords

## Architecture Overview

This is a Next.js 14 application for the PSH Advisory Committee website with both public-facing pages and an admin dashboard.

### Key Architectural Decisions

1. **Authentication**: Custom JWT-based system in `lib/auth.js` using bcryptjs and jsonwebtoken. Protected routes use `lib/middleware.js` for token verification.

2. **Data Storage**: Currently uses JSON files in `data/` directory (temporary solution). Files are read/written using Node.js fs module in API routes. Plan to migrate to PostgreSQL.

3. **Admin Panel**: Protected routes under `/admin/*` require authentication. Access via `/admin/login` (default: admin/admin123).

4. **API Structure**: All backend logic in `pages/api/` following Next.js conventions:
   - `/api/auth/*` - Authentication endpoints
   - `/api/admin/*` - Protected CRUD operations for content management
   - `/api/contact` - Public contact form submission

5. **Styling**: TailwindCSS with custom Washington State color palette defined in `tailwind.config.js`. Global styles in `styles/globals.css`.

6. **Component Structure**: Shared components in `components/` directory, particularly Layout.js which wraps all pages with consistent header/footer.

### Critical Files to Understand

- `lib/auth.js` - JWT token generation/verification, authentication helpers
- `lib/middleware.js` - API route protection middleware
- `pages/_app.js` - Global app wrapper with AuthProvider context
- `components/Layout.js` - Main layout structure for all pages
- `data/*.json` - Current data storage (blog posts, events, submissions)

### Known Issues

1. Homepage 404 error - needs investigation
2. ESLint not installed as dev dependency - run `npm install --save-dev eslint`

### Environment Variables

Create `.env.local` with:
```
JWT_SECRET=your-secret-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
```