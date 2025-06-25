# Vercel Blob Storage Setup Guide

## Quick Setup (5 minutes)

### 1. Enable Vercel Blob Storage

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `psh-committee-site`
3. Go to the **Storage** tab
4. Click **Connect Store** → **Create New** → **Blob**
5. Name it: `psh-documents`
6. Click **Create**

### 2. Get Your Token

After creating the Blob store:
1. Click on your new Blob store
2. Go to **.env.local** tab
3. Copy the `BLOB_READ_WRITE_TOKEN` value

### 3. Add to Environment Variables

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the following variable:
   ```
   Name: BLOB_READ_WRITE_TOKEN
   Value: [paste the token from step 2]
   Environment: Production, Preview, Development
   ```
3. Click **Save**

### 4. Redeploy

The next deployment will automatically use Vercel Blob Storage!

## What This Gives You

✅ **Persistent Storage**: Documents and metadata survive deployments  
✅ **File Uploads**: Upload PDFs, Word docs, Excel files, etc.  
✅ **Automatic Backups**: Vercel handles backups  
✅ **Global CDN**: Files served fast worldwide  
✅ **5GB Free**: Generous free tier  

## How It Works

1. **Metadata Storage**: Document info stored as JSON in blob (`documents/metadata.json`)
2. **File Storage**: Uploaded files stored in blob (`documents/files/...`)
3. **Existing PDFs**: Still served from `/public/documents/`
4. **New Uploads**: Stored in Vercel Blob with unique URLs

## Testing

After setup:
1. Go to `/admin/documents`
2. Click "Upload New Document"
3. Upload a test PDF
4. Verify it appears in the list
5. Download to confirm it works

## Costs

- **Free Tier**: 5GB storage, 1TB bandwidth/month
- **Perfect for**: Small to medium document libraries
- **Upgrade**: Available if you exceed limits

## Architecture

```
Vercel Blob Storage
├── documents/
│   ├── metadata.json         # Document database
│   └── files/               # Uploaded files
│       ├── document_123.pdf
│       └── report_456.docx
```

## Migration Notes

- Existing PDFs in `/public/documents/` continue to work
- New uploads go to Blob storage
- Metadata for all documents in one JSON file
- Easy to migrate to database later

## Troubleshooting

### "File upload service not configured"
- Add `BLOB_READ_WRITE_TOKEN` to environment variables
- Redeploy the application

### Documents not persisting
- Check token is correctly set in Vercel
- Verify Blob store is active

### 500 errors
- Check Vercel Function logs
- Ensure token has read/write permissions

## Next Steps

This solution provides:
- ✅ Persistent document storage
- ✅ File upload capability  
- ✅ Lightweight "database"
- ✅ Easy to implement
- ✅ Cost-effective

When ready to scale, you can:
1. Keep Blob for files
2. Move metadata to Vercel Postgres or KV
3. Add search, versioning, etc.

## Support

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Pricing](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)
- [API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
