# Quick Fix: Document Upload Error

## 🚨 The Issue
- Document upload failing with 500 error
- Error: "Cannot read properties of null (reading 'success')"

## ✅ The Fix
Updated the upload endpoint to use the existing blob storage function instead of dynamic import.

## 🚀 Deploy Now

```bash
# Navigate to project
cd d:\dev2\pshcommitteesite

# Add changes
git add -A

# Commit
git commit -m "Fix document upload 500 error - use existing blob storage function"

# Push to deploy
git push
```

## 🧪 Test After Deployment

1. **Login to Admin**
   - Go to: https://psh-committee-site.vercel.app/admin
   - Enter password

2. **Test Upload**
   - Navigate to Documents → Upload
   - Select a PDF file
   - Fill in details
   - Click Upload
   - Should see success message

3. **Verify Document**
   - Go to Documents list
   - New document should appear
   - Click to download/view

## 📝 What Changed

- Fixed `/pages/api/admin/upload.js`:
  - Added CORS headers
  - Replaced dynamic import with `uploadFileToBlob`
  - Better error handling
  - Always returns valid JSON

## 🔍 If Issues Persist

1. Check Vercel function logs
2. Look for console errors in browser
3. Verify BLOB_READ_WRITE_TOKEN is set in Vercel
4. Run test script locally:
   ```bash
   npm install form-data node-fetch
   node scripts/test-upload.js
   ```

## ✨ Expected Result
- Upload works smoothly
- Documents persist after deployment
- No more 500 errors