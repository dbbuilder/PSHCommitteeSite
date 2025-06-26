# Document Upload Fix - PSH Advisory Committee Website

## Issue Description
- **Error**: 500 Internal Server Error when uploading documents
- **Endpoint**: `/api/admin/upload`
- **Error Message**: "Cannot read properties of null (reading 'success')"
- **Date**: June 25, 2025

## Root Cause
The upload endpoint was using a dynamic import for `@vercel/blob` which could fail in production, causing the response to be null or malformed.

## Fixes Applied

### 1. Updated Upload Endpoint (`/pages/api/admin/upload.js`)

#### Added CORS Headers
```javascript
// Set CORS headers
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

// Handle OPTIONS request for CORS preflight
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}
```

#### Fixed Blob Storage Upload
- Replaced dynamic import with existing `uploadFileToBlob` function
- Added proper error handling at every step
- Ensured all responses return valid JSON

#### Enhanced Error Handling
- Added try-catch blocks for file reading
- Added try-catch blocks for blob upload
- Always clean up temp files
- Return detailed error messages

### 2. Key Changes

1. **Removed Dynamic Import**:
   ```javascript
   // OLD - Could fail in production
   const { put } = await import('@vercel/blob');
   
   // NEW - Uses existing function
   const uploadResult = await uploadFileToBlob(fileBuffer, uniqueFilename, file.mimetype);
   ```

2. **Better Error Responses**:
   - Always return `{ success: boolean, message: string }`
   - Include error details in development mode
   - Log errors to console for debugging

3. **Blob Storage Check**:
   - Check if `BLOB_READ_WRITE_TOKEN` is configured
   - Return demo response if not configured
   - Show warning to configure blob storage

## Testing the Fix

### 1. Deploy the Updated Code
```bash
cd d:\dev2\pshcommitteesite
git add -A
git commit -m "Fix document upload 500 error - use existing blob storage function"
git push
```

### 2. Test Upload Functionality
1. Go to Admin → Documents → Upload
2. Select a PDF file
3. Fill in title, description, category
4. Click Upload
5. Verify successful upload

### 3. Verify in Different Scenarios

#### With Blob Storage Configured:
- File should upload successfully
- Document should appear in documents list
- File should be downloadable

#### Without Blob Storage:
- Should show warning message
- Should create document record
- Should not crash

## Troubleshooting

### If Still Getting 500 Error:
1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Functions tab
   - Look for error logs from `api/admin/upload`

2. **Check Browser Console**:
   - Look for network errors
   - Check response format

3. **Verify Environment Variables**:
   - Ensure `BLOB_READ_WRITE_TOKEN` is set in Vercel
   - Ensure `JWT_SECRET` is configured

### Common Issues:

1. **"Unauthorized" Error**:
   - User is not logged in
   - JWT token expired
   - Wrong admin password

2. **"Invalid file type" Error**:
   - File type not in allowed list
   - Add more MIME types if needed

3. **"File too large" Error**:
   - File exceeds 10MB limit
   - Increase limit in formidable config

## Additional Improvements Made

1. **Logging**: Added console.log statements for debugging
2. **Cleanup**: Always clean up temp files, even on error
3. **Validation**: Better file type validation
4. **Response Format**: Consistent JSON response structure

## Next Steps

1. Monitor upload functionality after deployment
2. Check Vercel function logs for any errors
3. Consider adding progress indication for large files
4. Add client-side file size validation

## Success Criteria

✅ Upload endpoint returns 200 status on success
✅ Upload endpoint returns valid JSON always
✅ Error messages are descriptive
✅ Temp files are cleaned up
✅ Works with and without blob storage