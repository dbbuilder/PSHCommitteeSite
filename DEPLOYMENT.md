# Vercel Deployment Guide for PSH Committee Site

## Prerequisites
- GitHub repository: https://github.com/dbbuilder/PSHCommitteeSite
- Vercel account (free tier is sufficient)
- Environment variables ready

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect GitHub Repository
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import Git Repository
4. Connect your GitHub account if not already connected
5. Search for "PSHCommitteeSite" and click "Import"

### Step 2: Configure Project Settings
1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: Leave as `.` (root)
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

### Step 3: Add Environment Variables
Click "Environment Variables" and add the following:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$jJ1cEK.rhssUnFSIvYGld.TmDcH6d/wxIMNtTRlI3jOWYfbXPIfvu
JWT_SECRET=[CHANGE-THIS-TO-A-SECURE-RANDOM-STRING]
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[YOUR-EMAIL@gmail.com]
EMAIL_PASSWORD=[YOUR-EMAIL-APP-PASSWORD]
EMAIL_FROM=noreply@pshcommittee.wa.gov
EMAIL_TO=pshadcom@gmail.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[YOUR-GOOGLE-MAPS-API-KEY]
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=[YOUR-RECAPTCHA-SITE-KEY]
RECAPTCHA_SECRET_KEY=[YOUR-RECAPTCHA-SECRET-KEY]
NEXT_PUBLIC_SITE_URL=https://[YOUR-PROJECT].vercel.app
NEXT_PUBLIC_SITE_NAME=PSH Advisory Committee
```

**Important**: Replace the following with real values:
- `JWT_SECRET`: Generate a secure random string (32+ characters)
- `EMAIL_USER` and `EMAIL_PASSWORD`: For Gmail, use an App Password
- Google Maps API Key: Get from Google Cloud Console
- reCAPTCHA keys: Get from Google reCAPTCHA Admin

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be available at: `https://[project-name].vercel.app`

## Method 2: Deploy via CLI

### Step 1: Login to Vercel
```bash
vercel login
```

### Step 2: Deploy
```bash
cd /mnt/d/dev2/pshcommitteesite
vercel
```

Follow the prompts:
- Set up and deploy: Y
- Which scope: Select your account
- Link to existing project: N
- Project name: psh-committee-site (or your choice)
- Directory: ./ (current directory)
- Override settings: N

### Step 3: Add Environment Variables via CLI
```bash
# Add each environment variable
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD_HASH
vercel env add JWT_SECRET
# ... continue for all variables
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

## Post-Deployment Steps

### 1. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 2. Test Critical Functions
- [ ] Homepage loads without errors
- [ ] Navigation links work properly
- [ ] Admin login at `/admin/login`
- [ ] Blog posts display correctly
- [ ] Events calendar functions
- [ ] Contact form submission
- [ ] Resources page with PDF downloads

### 3. Security Checklist
- [ ] Change JWT_SECRET from default
- [ ] Update admin password if needed
- [ ] Verify HTTPS is enabled (automatic on Vercel)
- [ ] Test reCAPTCHA on contact form

### 4. Performance Optimization
- [ ] Enable Vercel Analytics (free tier available)
- [ ] Set up Web Vitals monitoring
- [ ] Configure caching headers (already in vercel.json)

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. Verify Node.js version compatibility

### Environment Variables Not Working
1. Redeploy after adding variables
2. Check variable names match exactly
3. Ensure NEXT_PUBLIC_ prefix for client-side vars

### 404 Errors
1. Clear cache and redeploy
2. Check file names are case-sensitive
3. Verify pages export default components

### API Routes Not Working
1. Check data files exist in deployment
2. Verify file paths are correct
3. Check API route exports

## Monitoring and Maintenance

1. **Logs**: View in Vercel Dashboard → Functions
2. **Analytics**: Enable in Project Settings
3. **Alerts**: Set up deployment notifications
4. **Updates**: Keep dependencies updated monthly

## Support
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project Issues: https://github.com/dbbuilder/PSHCommitteeSite/issues