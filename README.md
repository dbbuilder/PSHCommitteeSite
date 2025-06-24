# PSH Advisory Committee Website

A professional website for the Washington State Permanent Supportive Housing (PSH) Advisory Committee, providing public information, resources, and engagement opportunities.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
pshcommitteesite/
├── components/          # Reusable React components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── calendar/       # Calendar components
│   ├── blog/           # Blog-related components
│   ├── forms/          # Form components
│   └── admin/          # Admin dashboard components
├── pages/              # Next.js pages (routes)
│   ├── api/           # API routes
│   ├── admin/         # Admin pages
│   ├── blog/          # Blog pages
│   └── resources/     # Resource pages
├── public/            # Static assets
│   ├── documents/     # PDF documents
│   └── images/        # Image assets
├── styles/            # Global styles and Tailwind config
├── lib/               # Utility functions and helpers
├── data/              # JSON data storage
└── docs/              # Documentation and source materials
```
## Features

- **Public Calendar**: View committee events and meetings
- **Blog System**: News and updates from the PSH Advisory Committee
- **Interactive Map**: Google Maps integration showing PSH locations
- **Contact Form**: Public interest form with spam protection
- **Document Library**: Access to legislative documents, reports, and resources
- **Audio Content**: Educational audio overview from NotebookLM
- **Admin Dashboard**: Secure content management system

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_hashed_password
JWT_SECRET=your_jwt_secret

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@pshcommittee.wa.gov
EMAIL_TO=admin@pshcommittee.wa.gov

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```
## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd pshcommitteesite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see above)

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design on all screen sizes

## Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel --prod
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is property of the PSH Advisory Committee and the Washington State Department of Commerce.