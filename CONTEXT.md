# PSH Advisory Committee Website - Project Context

## 🚨 CRITICAL PRIORITY - Data Persistence Crisis

**THE PROBLEM**: All content (blog posts, events, form submissions) is currently stored in local JSON files that get WIPED every time the site is deployed to Vercel. This means:
- Admin creates blog post → deploys site → blog post is GONE
- User submits contact form → deploy happens → submission is LOST
- Events added to calendar → deploy → events DISAPPEAR

**THE SOLUTION**: Migrate all data storage to Vercel Blob Storage (like we did for documents).

## Project Overview

**Name**: PSH Advisory Committee Website  
**URL**: https://psh-committee-site.vercel.app  
**Repository**: https://github.com/dbbuilder/PSHCommitteeSite  
**Purpose**: Official website for Washington State Permanent Supportive Housing Advisory Committee  
**Stack**: Next.js 14.2.3, React 18.3.1, Tailwind CSS, Vercel hosting  

## File Structure & Key Paths

```
d:\dev2\pshcommitteesite\
├── pages/
│   ├── api/
│   │   ├── admin/          # Admin API endpoints (need blob migration)
│   │   │   ├── blog.js     # Blog CRUD - uses local JSON ❌
│   │   │   ├── events.js   # Events CRUD - uses local JSON ❌
│   │   │   ├── submissions.js # Form submissions - uses local JSON ❌
│   │   │   ├── documents.js # Documents CRUD - uses blob storage ✅
│   │   │   └── upload.js   # File upload - uses blob storage ✅
│   │   ├── blog.js         # Public blog API
│   │   ├── events.js       # Public events API
│   │   ├── documents.js    # Public documents API
│   │   └── contact.js      # Contact form submission
│   ├── admin/              # Admin pages
│   ├── blog/               # Blog pages
│   └── [other pages]
├── lib/
│   ├── blobStorage.js      # ✅ Blob storage for documents (WORKING)
│   ├── documentsStore.js   # In-memory fallback
│   └── auth.js             # Authentication utilities
├── data/                   # ❌ LOCAL JSON FILES (PROBLEM)
│   ├── blog.json          # Blog posts - gets wiped on deploy
│   ├── events.json        # Events - gets wiped on deploy
│   └── submissions/       # Form submissions - gets wiped on deploy
├── components/             # React components
├── public/
│   └── documents/         # Static PDF files
└── scripts/               # Utility scripts
```

## Current Storage Status

| Feature | Storage Method | Persists? | Priority |
|---------|---------------|-----------|----------|
| Documents | ✅ Vercel Blob | YES | DONE |
| Blog Posts | ❌ Local JSON | NO | 1 |
| Events | ❌ Local JSON | NO | 2 |
| Submissions | ❌ Local JSON | NO | 3 |

## Development Setup

### Local Development
```bash
# Install dependencies
npm install

# Run on port 12500 (configured to avoid conflicts)
npm run dev

# Or use Windows helper
dev.bat
```

### Environment Variables
Create `.env.local`:
```
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=PSH@dm1n!
BLOB_READ_WRITE_TOKEN=[GET FROM VERCEL DASHBOARD]
```

### Vercel Blob Storage Setup
1. Go to Vercel Dashboard → Storage → Create Blob Store
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Add to Environment Variables in Vercel settings

## Tools & Commands

### Desktop Commander (DC)
```bash
# File operations
DC: read_file, write_file, edit_block, search_code
DC: list_directory, create_directory, move_file

# Process management
DC: execute_command, read_output, force_terminate

# Development
DC: npm run dev    # Start dev server on port 12500
DC: npm run build  # Build for production
DC: npm test       # Run Playwright tests
```

### Testing
```bash
# Run tests
npm run test

# Test specific file
npx playwright test tests/main-site/navigation.test.js

# Open Playwright UI
npx playwright test --ui
```

### Git Commands
```bash
# Commit and push
git add -A && git commit -m "message" && git push
```

## API Endpoints Reference

### Admin APIs (Require JWT Auth)
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog` - Update blog post
- `DELETE /api/admin/blog` - Delete blog post
- `GET /api/admin/blog` - List all posts

- `POST /api/admin/events` - Create event
- `PUT /api/admin/events` - Update event
- `DELETE /api/admin/events` - Delete event
- `GET /api/admin/events` - List all events

- `GET /api/admin/submissions` - List submissions
- `GET /api/admin/submissions/[id]` - Get submission

### Public APIs
- `GET /api/blog` - Public blog posts
- `GET /api/events` - Public events
- `GET /api/documents` - Public documents
- `POST /api/contact` - Submit contact form

## Critical Migration Tasks (In Priority Order)

### 1. Blog Posts Migration (2-3 hours)
**File**: `/pages/api/admin/blog.js`
- Currently reads/writes to `/data/blog.json`
- Need to create `/lib/blogBlobStorage.js`
- Copy pattern from `/lib/blobStorage.js`
- Update both admin and public APIs

### 2. Events Migration (2-3 hours)
**File**: `/pages/api/admin/events.js`
- Currently reads/writes to `/data/events.json`
- Need to create `/lib/eventsBlobStorage.js`
- Update calendar page to use blob data

### 3. Submissions Migration (3-4 hours)
**Files**: `/pages/api/contact.js`, `/pages/api/admin/submissions.js`
- Currently saves to `/data/submissions/[id].json`
- Need to create `/lib/submissionsBlobStorage.js`
- Handle file attachments properly

## Success Pattern (From Documents)

The documents feature already uses blob storage successfully:
1. `/lib/blobStorage.js` - Handles all blob operations
2. Falls back to in-memory storage if no token
3. Maintains backward compatibility
4. Same API interface

**Copy this pattern for blog, events, and submissions!**

## Testing After Migration

1. Create content (blog post, event, submission)
2. Deploy to Vercel
3. Verify content still exists after deployment
4. Test with and without blob token

## Known Issues to Fix

1. **Data Persistence**: Critical - all content lost on deploy
2. **Upload Errors**: Fixed for documents, need same fix for other uploads
3. **Safari Mobile**: Menu doesn't close after navigation
4. **Edge Mobile**: Hamburger button visibility
5. **Firefox**: Performance timeouts in tests

## Deployment Process

```bash
# 1. Test locally
npm run dev

# 2. Build
npm run build

# 3. Commit and push
git add -A && git commit -m "description" && git push

# 4. Vercel auto-deploys from GitHub
```

## Support Documentation

- `TODO.md` - Current task list with priorities
- `REQUIREMENTS.md` - Project requirements
- `API_FIXES.md` - API troubleshooting
- `VERCEL_BLOB_SETUP.md` - Blob storage setup guide
- `PORT_CONFIGURATION.md` - Development port setup
- `TEST_PLAN.md` - Testing strategy

## Next Steps for Developer

1. **Read TODO.md** - Understand critical blob storage migration
2. **Set up Vercel Blob** - Get token from Vercel dashboard
3. **Start with Blog migration** - Highest visibility feature
4. **Test thoroughly** - Ensure no data loss
5. **Document changes** - Update this context as you go

## Contact & Resources

- **Vercel Dashboard**: https://vercel.com/your-account/psh-committee-site
- **Blob Storage Docs**: https://vercel.com/docs/storage/vercel-blob
- **Next.js Docs**: https://nextjs.org/docs

**Remember**: The site is currently LOSING ALL DATA on every deployment. This is the #1 priority to fix!
