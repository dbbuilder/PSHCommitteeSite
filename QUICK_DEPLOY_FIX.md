# Quick Fix Deployment Guide

## Immediate Steps to Fix the Vercel Deployment

### 1. Commit and Push the Changes
```bash
git add .
git commit -m "Fix 405 errors on admin API endpoints - handle data structure and CORS"
git push origin main
```

### 2. Verify Vercel Auto-Deploy
- Check https://vercel.com/[your-username]/psh-committee-site
- Wait for the deployment to complete (usually 1-2 minutes)
- Check the Function logs for any errors

### 3. Test the Fix
After deployment, test the admin functionality:

1. Go to https://psh-committee-site.vercel.app/admin/login
2. Login with admin credentials
3. Try creating a blog post at /admin/blog/new
4. Try creating an event at /admin/events/new

### 4. If Issues Persist

#### Check Vercel Function Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for `/api/admin/blog` and `/api/admin/events`

#### Verify Environment Variables:
1. In Vercel Dashboard → Settings → Environment Variables
2. Ensure these are set:
   - `JWT_SECRET` (any secure random string)
   - `ADMIN_USERNAME` (optional, defaults to 'admin')
   - `ADMIN_PASSWORD_HASH` (optional, defaults to hash for 'admin123')

#### Clear Browser Cache:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 5. Alternative: Force Redeploy
If auto-deploy doesn't trigger:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments
4. Click "..." on the latest deployment
5. Select "Redeploy"

## Summary of Changes Made

✅ Fixed CORS headers to be set on all responses
✅ Fixed data structure handling for blog.json and events.json
✅ Added proper error handling and debugging
✅ Fixed ID generation and comparison logic
✅ Created test endpoints and scripts

The main issue was that the API was expecting arrays but the JSON files contained objects with array properties. This has been fixed to handle both formats correctly.