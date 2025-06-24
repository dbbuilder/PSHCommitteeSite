# PSH Advisory Committee Website Requirements

## Project Overview
Professional website for the Washington State Permanent Supportive Housing (PSH) Advisory Committee to provide public information, resources, and engagement opportunities.

## Core Features

### 1. Public Calendar System
- Display committee events and meetings
- Event details (date, time, location, description)
- iCal/Google Calendar export functionality
- Responsive calendar view (month/week/list)
- Admin interface to manage events

### 2. Blog/News System
- Admin-created blog posts
- Categories and tags
- Rich text editor for content creation
- Image upload capability
- Post scheduling and draft functionality
- SEO-friendly URLs and metadata
- RSS feed

### 3. Interactive Map Integration
- Embed Google Maps showing PSH locations
- Map ID: 1ctEK4jPkda6gKKqi3FDoSTyGPVUfHBk
- Full-screen toggle option
- Mobile-responsive implementation

### 4. Public Interest Form
- Contact form for public engagement
- Required fields: Name, Email, Phone (optional), Message
- Spam protection:
  - reCAPTCHA integration
  - Honeypot fields
  - Rate limiting
  - Email validation
- Form submissions stored in database
- Email notifications to administrators
### 5. Document Resource Center
- PDF document hosting and distribution
- Document categories:
  - Legislative Documents
  - Committee Reports
  - Educational Resources
  - Meeting Minutes
- Search functionality
- Download tracking
- Mobile-friendly document viewer

### 6. Audio Content Integration
- NotebookLM audio overview embed
- Audio player controls
- Transcript availability
- Mobile-responsive player

### 7. Administrative Dashboard
- Secure login with JSON-based authentication
- Role-based access (Admin, Editor)
- Content management for:
  - Blog posts
  - Calendar events
  - Documents
  - Form submissions
- Analytics dashboard
- User management

## Technical Requirements

### Frontend
- Next.js framework
- TailwindCSS for styling
- Responsive design (mobile-first)
- SEO optimization
- Accessibility compliance (WCAG 2.1 AA)
- Progressive Web App capabilities
### Backend/Data
- API routes for data management
- JSON file-based storage (initial implementation)
- File upload handling
- Email service integration
- Session management
- API rate limiting

### Security
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure headers
- Content Security Policy
- HTTPS enforcement

### Performance
- Image optimization
- Lazy loading
- Code splitting
- Static generation where possible
- CDN integration (Vercel)
- < 3 second initial load time

## Deployment
- Vercel hosting
- Environment variables for configuration
- Automated deployment from Git
- Domain configuration
- SSL certificate

## Content Migration
- Extract and organize content from source PDFs
- Create initial blog posts from existing materials
- Set up document library with provided files
- Configure committee information pages

## Future Considerations
- Database migration (PostgreSQL)
- Advanced search functionality
- Multi-language support
- Newsletter integration
- Social media integration
- Advanced analytics