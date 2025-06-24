# PSH Advisory Committee Website - Project Context for Next Session

## Project Overview
- **Project Name**: PSH Advisory Committee Website
- **Location**: `d:\dev2\pshcommitteesite\`
- **Status**: 95% Complete - Website functionality complete, needs deployment fixes
- **Tech Stack**: Next.js 14.2.3, React 18.3.1, TailwindCSS, JWT Auth
- **Contact Email**: pshadcom@gmail.com

## Current Issues Requiring Immediate Attention

### 1. Homepage 404 Error (CRITICAL)
```
Failed to load resource: the server responded with a status of 404 (Not Found)
GET http://localhost:3000/ 404 (Not Found)
```
**Possible causes**:
- Next.js routing issue
- Missing or incorrect export in pages/index.js
- Development server cache
- Port conflict or server configuration

### 2. Build Process Error
```
ESLint must be installed in order to run during builds: npm install --save-dev eslint
```
**Solution**: Run `npm install --save-dev eslint`

## Project Structure
```
pshcommitteesite/
├── components/          # Layout, Header, Footer (UPDATED with pshadcom@gmail.com)
├── data/               # JSON storage for blog, events
│   └── submissions/    # Contact form submissions (with sample)
├── docs/source/        # Original PDF documents
├── lib/                # Auth utilities, middleware
├── pages/              
│   ├── admin/          # Admin pages (ALL COMPLETE)
│   │   ├── blog/
│   │   │   └── edit/[id].js  # NEW - Blog edit page
│   │   ├── events/
│   │   │   └── edit/[id].js  # NEW - Event edit page
│   │   ├── submissions.js     # NEW - Submissions viewer
│   │   └── submissions/[id].js # NEW - Individual submission
│   ├── api/            # API routes
│   │   └── admin/
│   │       └── submissions/   # NEW - Submission APIs
│   ├── blog/           # Public blog pages
│   └── [other pages]   # Public pages (contact UPDATED)
├── public/             
│   ├── documents/      # PDF downloads
│   ├── robots.txt      # NEW - SEO file
│   └── site.webmanifest # NEW - PWA manifest
├── scripts/            # Utility scripts
├── styles/             # Global CSS
├── .env.local          # Environment variables (CONFIGURED)
├── .eslintrc.json      # NEW - ESLint config
├── .prettierrc         # NEW - Prettier config
└── TODO.md             # UPDATED with current status
```

## Authentication & Access
- **Admin URL**: http://localhost:3000/admin/login
- **Username**: admin
- **Password**: admin123
- **Password Hash**: $2a$10$jJ1cEK.rhssUnFSIvYGld.TmDcH6d/wxIMNtTRlI3jOWYfbXPIfvu

## Key Files Modified in Last Session
1. `components/Footer.js` - Updated with committee name and pshadcom@gmail.com
2. `pages/contact.js` - Added email contact, updated organization name
3. `pages/about.js` - Updated Department of Commerce references
4. `data/blog.json` - Updated content references
5. `README.md` - Updated license section
6. All admin features completed (submissions viewer, edit pages)

## Environment Variables (.env.local)
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$jJ1cEK.rhssUnFSIvYGld.TmDcH6d/wxIMNtTRlI3jOWYfbXPIfvu
JWT_SECRET=development-secret-key-change-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=test@example.com
EMAIL_PASSWORD=test-password
EMAIL_FROM=noreply@pshcommittee.wa.gov
EMAIL_TO=pshadcom@gmail.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=placeholder-google-maps-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=placeholder-recaptcha-site-key
RECAPTCHA_SECRET_KEY=placeholder-recaptcha-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=PSH Advisory Committee
```

## Git Status
- Repository initialized with 4 commits
- Latest commit: "Complete admin features and add polish"
- All features implemented and committed

## Required Tools for Next Session
1. **sequential-thinking**: For debugging the 404 issue
2. **desktop-commander**: For file operations and running commands
3. **playwright**: For testing the website
4. **artifacts**: For any code fixes
5. **web_search**: For troubleshooting Next.js issues if needed

## Next Steps Priority Order
1. **Fix Homepage 404 Error**:
   ```bash
   cd d:\dev2\pshcommitteesite
   # Check if server is running
   # Clear .next cache
   rm -rf .next
   # Restart dev server
   npm run dev
   ```

2. **Install ESLint**:
   ```bash
   npm install --save-dev eslint
   ```

3. **Test Production Build**:
   ```bash
   npm run build
   npm start
   ```

4. **Deploy to Vercel**:
   - Update environment variables
   - Connect GitHub repository
   - Configure custom domain
   - Set up production API keys

## Testing Checklist
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Admin login functions
- [ ] Blog CRUD operations
- [ ] Event CRUD operations  
- [ ] Contact form submission
- [ ] Submission viewer works
- [ ] Mobile responsive design
- [ ] Google Maps loads (need real API key)

## Production Requirements
- Real Google Maps API key
- Real reCAPTCHA keys
- SMTP configuration for emails
- Secure JWT secret
- Custom domain setup
- SSL certificate
- Analytics setup

## Contact Information
- **Committee Email**: pshadcom@gmail.com
- **Physical Address**: 
  PSH Advisory Committee
  c/o Washington State Department of Commerce
  1011 Plum St. SE
  P.O. Box 42525
  Olympia, WA 98504-2525

This context file contains everything needed to continue the project in the next session.