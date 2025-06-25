# Vercel Blob Storage Migration Guide

## Overview

This guide documents the migration of the PSH Advisory Committee Website from local JSON file storage to Vercel Blob Storage. This migration solves the critical issue where all user-generated content (blog posts, events, form submissions) was being lost on every deployment.

## Problem Statement

Previously, all dynamic content was stored in local JSON files:
- `/data/blog.json` - Blog posts
- `/data/events.json` - Events
- `/data/submissions/*.json` - Contact form submissions

**Issue**: These files were wiped clean every time the site was deployed to Vercel, causing complete data loss.

## Solution

Migrated all data storage to Vercel Blob Storage, which provides:
- ✅ Persistent storage across deployments
- ✅ Scalable cloud storage
- ✅ Easy integration with Vercel platform
- ✅ Fallback to in-memory storage for local development

## Architecture

### Storage Modules

Created three new blob storage modules in `/lib/`:

1. **`blogBlobStorage.js`** - Manages blog posts
   - Stores all posts in `blog/metadata.json`
   - CRUD operations: getAllBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost
   - Includes getBlogPostBySlug for URL-based queries

2. **`eventsBlobStorage.js`** - Manages events
   - Stores all events in `events/metadata.json`
   - CRUD operations: getAllEvents, addEvent, updateEvent, deleteEvent

3. **`submissionsBlobStorage.js`** - Manages form submissions
   - Stores all submissions in `submissions/metadata.json`
   - CRUD operations: getAllSubmissions, addSubmission, updateSubmission, deleteSubmission
   - Includes markSubmissionAsRead functionality

### API Updates

Updated all API endpoints to use blob storage:

**Admin APIs** (require JWT authentication):
- `/api/admin/blog.js` - Blog management
- `/api/admin/events.js` - Event management
- `/api/admin/submissions.js` - View submissions
- `/api/admin/submissions/[id].js` - Individual submission management

**Public APIs**:
- `/api/blog.js` - Public blog posts (filters out drafts)
- `/api/events.js` - Public events (filters past events by default)
- `/api/contact.js` - Contact form submission

## Setup Instructions

### 1. Configure Vercel Blob Storage

1. Go to your Vercel Dashboard
2. Navigate to Storage → Create Blob Store
3. Name it (e.g., "psh-committee-storage")
4. Copy the `BLOB_READ_WRITE_TOKEN`

### 2. Add Environment Variable

Add to `.env.local` for local development:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx...
```

Add to Vercel Environment Variables:
1. Go to Project Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN` with the token value
3. Apply to all environments (Production, Preview, Development)

### 3. Deploy the Updated Code

```bash
git add -A
git commit -m "Migrate to Vercel Blob Storage for data persistence"
git push
```

Vercel will automatically deploy the changes.

### 4. Migrate Existing Data (if any)

If you have existing data in JSON files, run the migration script:

```bash
# Set the blob token
export BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx...

# Run migration
node scripts/migrate-to-blob.js
```

## How It Works

### Blob Storage Pattern

Each module follows the same pattern:

1. **Metadata Storage**: All data is stored as JSON in blob storage
2. **Fallback Support**: If no blob token, falls back to in-memory storage
3. **Initialization**: Checks for existing data on first request
4. **Default Data**: Provides sensible defaults if no data exists

Example flow for blog posts:
```javascript
// 1. Check for blob token
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  // Use in-memory storage
  return memoryStore;
}

// 2. Fetch from blob storage
const response = await fetch(`https://blob.vercel-storage.com/blog/metadata.json`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 3. Return data or create defaults
if (response.ok) {
  return await response.json();
} else {
  // Create with defaults
  await saveBlogPostsMetadata(defaultBlogPosts);
  return defaultBlogPosts;
}
```

### API Integration

APIs now use the blob storage modules instead of filesystem:

```javascript
// Before (filesystem)
const fs = require('fs')
const blogData = fs.readFileSync(blogPath, 'utf8')

// After (blob storage)
import { getAllBlogPosts } from '../../../lib/blogBlobStorage'
const posts = await getAllBlogPosts()
```

## Local Development

The system works seamlessly in local development:

1. **With Blob Token**: Uses Vercel Blob Storage (same as production)
2. **Without Blob Token**: Uses in-memory storage (data persists during dev session)

This allows developers to work without needing blob storage credentials.

## Testing the Migration

### 1. Create Test Data
- Add a blog post through the admin panel
- Create an event
- Submit a contact form

### 2. Deploy to Vercel
```bash
git push
```

### 3. Verify Data Persistence
- Visit the site after deployment
- Check that all content is still present
- Verify blog posts, events, and submissions persist

### 4. Monitor Blob Storage
- Check Vercel Dashboard → Storage → Your Blob Store
- View stored files and usage metrics

## Troubleshooting

### Issue: "BLOB_READ_WRITE_TOKEN not configured"
**Solution**: Ensure the token is added to environment variables in both local `.env.local` and Vercel settings.

### Issue: Data not persisting
**Solution**: 
1. Check browser console for errors
2. Verify blob token is correct
3. Check Vercel logs for API errors

### Issue: 404 errors on blob storage
**Solution**: This is normal on first use. The system will create the metadata files automatically.

## Benefits

1. **Data Persistence**: Content survives deployments
2. **Scalability**: No file system limitations
3. **Performance**: CDN-backed storage
4. **Reliability**: Managed by Vercel infrastructure
5. **Cost-Effective**: Generous free tier

## Future Enhancements

1. **Backup System**: Automated backups to external storage
2. **Data Export**: Admin tools to export all data
3. **Search Integration**: Full-text search using blob metadata
4. **File Attachments**: Store submission attachments in blob storage
5. **Version History**: Track changes to posts and events

## Maintenance

### Regular Tasks
- Monitor blob storage usage in Vercel Dashboard
- Periodically clean old submissions if needed
- Keep blob token secure and rotate if compromised

### Data Management
- All data is stored as JSON for easy export/import
- Use the migration script to backup/restore data
- Consider implementing automated backups

## Conclusion

The migration to Vercel Blob Storage successfully resolves the critical data persistence issue. All user-generated content now safely persists across deployments, providing a reliable foundation for the PSH Advisory Committee Website.