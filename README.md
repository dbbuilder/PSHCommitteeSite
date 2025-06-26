# PSH Advisory Committee Website

A modern, accessible website for the Washington State Permanent Supportive Housing (PSH) Advisory Committee, providing public information, resources, and a comprehensive content management system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (port 12500)
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 🌟 Key Features

### Public Features
- **📅 Events Calendar** - View upcoming committee meetings and events
- **📰 Blog/News** - Latest updates and announcements
- **📚 Document Library** - Access legislative documents, reports, and resources
- **🗺️ Interactive Map** - Google Maps integration showing PSH locations
- **📝 Contact Form** - Public engagement with spam protection
- **🎧 Audio Content** - Educational overview about PSH
- **♿ Accessibility** - WCAG 2.1 compliant, screen reader friendly

### Admin Features
- **🔐 Secure Dashboard** - JWT-based authentication
- **📝 Content Management** - Create, edit, and delete blog posts
- **📅 Event Management** - Manage calendar events
- **📄 Document Upload** - Upload and organize documents with preview
- **📬 Submission Tracking** - View and manage contact form submissions
- **📊 Real-time Analytics** - Dashboard with live content counts

## 🏗️ Technical Stack

- **Framework**: Next.js 14.2.3
- **Frontend**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1
- **Storage**: Vercel Blob Storage
- **Authentication**: JWT tokens
- **Maps**: Google Maps API
- **Testing**: Playwright
- **Deployment**: Vercel

## 📁 Project Structure

```
pshcommitteesite/
├── components/          # Reusable React components
│   ├── Layout.js       # Main layout wrapper
│   ├── Header.js       # Public site header
│   ├── AdminHeader.js  # Admin navigation
│   ├── Footer.js       # Site footer
│   └── CalendarView.js # Event calendar component
├── pages/              # Next.js pages (routes)
│   ├── api/           # API endpoints
│   │   ├── auth/      # Authentication endpoints
│   │   ├── admin/     # Admin CRUD operations
│   │   └── public/    # Public data endpoints
│   ├── admin/         # Admin panel pages
│   └── blog/          # Public blog pages
├── lib/               # Utility functions
│   ├── auth.js        # Authentication utilities
│   ├── blogBlobStorage.js    # Blog data persistence
│   ├── eventsBlobStorage.js  # Events data persistence
│   └── submissionsBlobStorage.js # Form data persistence
├── public/            # Static assets
│   ├── documents/     # PDF documents
│   └── images/        # Image assets
├── styles/            # Global styles
└── scripts/           # Utility scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Authentication (Required)
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$... # Generate with bcrypt

# Vercel Blob Storage (Required for data persistence)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx...

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key

# Email (Optional - for future email notifications)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

### Vercel Blob Storage Setup

1. Go to Vercel Dashboard → Storage → Create Blob Store
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Add to environment variables in Vercel settings
4. All content (blog posts, events, submissions) will persist across deployments

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)
- Google Maps API key (optional)

### Local Development

```bash
# Clone repository
git clone https://github.com/dbbuilder/PSHCommitteeSite
cd pshcommitteesite

# Install dependencies
npm install

# Create .env.local file with required variables

# Run development server
npm run dev

# Access at http://localhost:12500
```

### Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test file
npx playwright test tests/main-site/navigation.test.js
```

## 🚢 Deployment

### Automatic Deployment (Recommended)

1. Push code to GitHub
2. Vercel automatically deploys from main branch
3. Preview deployments created for pull requests

### Manual Deployment

```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod
```

## 📝 Admin Guide

### Default Login
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `admin123` (change in production!)

### Content Management

1. **Blog Posts**
   - Create with Markdown support
   - Save as drafts or publish immediately
   - Automatic slug generation

2. **Events**
   - Add date, time, location
   - Optional registration links
   - Automatic sorting by date

3. **Documents**
   - Upload PDF, Word, Excel files
   - Preview before upload
   - Organize by categories

4. **Submissions**
   - View contact form submissions
   - Mark as read/unread
   - Export functionality (coming soon)

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port 3000 already in use**
   - Development configured for port 12500
   - Check `package.json` for port settings

3. **Upload errors**
   - Verify `BLOB_READ_WRITE_TOKEN` is set
   - Check file size (10MB limit)
   - Ensure correct file types

4. **Login issues**
   - Username and password are case-sensitive
   - Check JWT_SECRET is set
   - Clear browser localStorage if needed

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- Use ESLint and Prettier
- Write meaningful commit messages
- Ensure responsive design
- Add tests for new features
- Comment complex logic

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](API_DOCS.md)
- [Blob Storage Setup](BLOB_STORAGE_MIGRATION.md)
- [Testing Guide](TEST_PLAN.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## 📄 License

This project is property of the PSH Advisory Committee and the Washington State Department of Commerce.

## 🙏 Acknowledgments

- Washington State Department of Commerce
- PSH Advisory Committee Members
- Community Contributors

---

**Current Version**: 1.0.0  
**Last Updated**: June 25, 2025  
**Maintainer**: PSH Advisory Committee IT Team