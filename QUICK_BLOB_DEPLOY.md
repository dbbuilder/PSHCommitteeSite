# Quick Deployment Guide - Blob Storage Migration

## 🚀 Deploy NOW - Fix Data Persistence

### Step 1: Get Vercel Blob Token (5 minutes)
1. Go to [Vercel Dashboard](https://vercel.com) → Your Project
2. Navigate to **Storage** → **Create Blob Store**
3. Name it: `psh-committee-storage`
4. Copy the `BLOB_READ_WRITE_TOKEN` that starts with `vercel_blob_rw_`

### Step 2: Add Environment Variable (2 minutes)
1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Add new variable:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: (paste the token from Step 1)
   - Environment: ✅ Production, ✅ Preview, ✅ Development
3. Click **Save**

### Step 3: Deploy the Code (5 minutes)
```bash
# From project root: d:\dev2\pshcommitteesite

# Add all changes
git add -A

# Commit with message
git commit -m "Add Vercel Blob Storage for data persistence - fixes data loss on deployment"

# Push to GitHub (triggers Vercel deployment)
git push
```

### Step 4: Verify Deployment (5 minutes)
1. Watch deployment progress in Vercel Dashboard
2. Once deployed, visit: https://psh-committee-site.vercel.app
3. Check that site loads correctly

### Step 5: Test Data Persistence (10 minutes)

#### Test Blog Posts:
1. Go to Admin → Blog
2. Create a test post:
   - Title: "Test Blob Storage"
   - Content: "This post should persist after deployment"
3. Save the post
4. Make a small code change (e.g., add a comment to any file)
5. Deploy again (git commit & push)
6. Check if the blog post still exists

#### Test Events:
1. Go to Admin → Events
2. Create a test event:
   - Title: "Test Event"
   - Date: Tomorrow
   - Location: "Virtual"
3. Save the event
4. Deploy again with a small change
5. Verify event persists

#### Test Submissions:
1. Go to Contact page
2. Submit a test form
3. Check in Admin → Submissions
4. Deploy again
5. Verify submission persists

## 🔧 Troubleshooting

### If data doesn't persist:
1. Check Vercel logs for errors
2. Verify blob token is set correctly
3. Check browser console for API errors
4. Ensure all files from this update are deployed

### To migrate existing data:
```bash
# If you have existing data in JSON files
cd d:\dev2\pshcommitteesite
set BLOB_READ_WRITE_TOKEN=your_token_here
node scripts/migrate-to-blob.js
```

## ✅ Success Indicators
- No more data loss on deployment
- Blog posts persist
- Events persist
- Form submissions persist
- Admin can manage content reliably

## 📞 Need Help?
- Check `BLOB_STORAGE_MIGRATION.md` for detailed documentation
- Review Vercel logs for specific errors
- Verify all environment variables are set correctly