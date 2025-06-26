# Upload Error Debug Guide

## Current Status
The document upload is still returning a 500 error. We've implemented several debugging tools to help isolate the issue.

## Debug Tools Created

### 1. Test HTML Page
**Location**: `/upload-test.html`
**URL**: https://psh-committee-site.vercel.app/upload-test.html

This page allows you to:
1. Get an auth token
2. Test the upload endpoint
3. Upload a file and see the raw response

### 2. Test Endpoints

#### `/api/admin/upload-test`
- Simple endpoint to verify authentication works
- Returns server info and confirms connectivity

#### `/api/admin/upload-simple`
- Simplified upload endpoint without formidable
- Tests basic request/response flow

### 3. Enhanced Logging
The main upload endpoint now includes extensive console logging:
- Authentication status
- Form parsing details
- File information
- Blob storage operations
- Error details with stack traces

## How to Debug

### Option 1: Use the Test Page (Recommended)
1. Deploy the changes first:
   ```bash
   git add -A
   git commit -m "Add upload debugging tools"
   git push
   ```

2. Visit: https://psh-committee-site.vercel.app/upload-test.html

3. Follow the steps:
   - Enter password and get token
   - Test the endpoint (should show it's working)
   - Try uploading a small PDF

4. Check browser console for detailed logs

### Option 2: Check Vercel Logs
1. Go to Vercel Dashboard
2. Navigate to Functions tab
3. Look for `api/admin/upload` logs
4. Check for specific error messages

### Option 3: Test Locally
```bash
cd d:\dev2\pshcommitteesite
npm run dev

# In another terminal:
node scripts/test-upload.js
```

## Common Issues to Check

### 1. Formidable Version
- Current version: 3.5.4
- Might have compatibility issues with Vercel

### 2. File Size
- Limit is 10MB
- Try with a very small PDF first

### 3. Blob Storage Token
- Verify BLOB_READ_WRITE_TOKEN is set in Vercel
- Check if token has correct permissions

### 4. Response Parsing
- Client expects JSON response
- Server must always return valid JSON

## Next Steps

1. **Deploy these debug tools**
2. **Use test page to get detailed error**
3. **Check Vercel function logs**
4. **Report specific error message**

Once we have the specific error from the logs, we can fix the root cause.

## If All Else Fails

Consider using a different file upload approach:
1. Base64 encode files on client
2. Send as JSON instead of multipart
3. Use a different form parsing library
4. Use Vercel's built-in file handling