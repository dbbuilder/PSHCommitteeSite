# Quick Vercel Deployment Steps

## Option 1: GitHub Integration (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Log in or create account

2. **Import GitHub Repository**
   - Click "Import Project"
   - Choose "Import Git Repository"
   - Authorize GitHub if needed
   - Select: `dbbuilder/PSHCommitteeSite`

3. **Configure Environment Variables**
   Copy and paste these into the Environment Variables section:

   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=$2a$10$jJ1cEK.rhssUnFSIvYGld.TmDcH6d/wxIMNtTRlI3jOWYfbXPIfvu
   JWT_SECRET=your-super-secret-jwt-key-change-this
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=test@example.com
   EMAIL_PASSWORD=test-password
   EMAIL_FROM=noreply@pshcommittee.wa.gov
   EMAIL_TO=pshadcom@gmail.com
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=placeholder-google-maps-key
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=placeholder-recaptcha-site-key
   RECAPTCHA_SECRET_KEY=placeholder-recaptcha-secret-key
   NEXT_PUBLIC_SITE_URL=https://psh-committee.vercel.app
   NEXT_PUBLIC_SITE_NAME=PSH Advisory Committee
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - Your site will be live!

## Option 2: CLI Deployment

1. **Login to Vercel**
   ```bash
   vercel login
   ```
   Enter your email and follow the verification link

2. **Deploy from Project Directory**
   ```bash
   cd /mnt/d/dev2/pshcommitteesite
   vercel --prod
   ```

3. **First Time Setup Prompts**
   - Set up and deploy? **Y**
   - Scope: **Your username**
   - Link to existing project? **N**
   - Project name: **psh-committee-site**
   - Directory: **./**
   - Override settings? **N**

## After Deployment

Your site will be available at:
- `https://psh-committee-site.vercel.app`
- Or custom domain if configured

### Test These Features:
1. Homepage loads correctly
2. Navigation menu is visible (white text on blue background)
3. Blog and Events sections work
4. Admin login at `/admin/login` (username: admin, password: admin123)
5. Contact form displays

### Production Checklist:
- [ ] Change JWT_SECRET to a secure value
- [ ] Get real Google Maps API key
- [ ] Get real reCAPTCHA keys
- [ ] Configure email settings
- [ ] Set up custom domain (optional)

## Common Issues

**Build Timeout**: Already fixed by disabling ESLint during builds

**Environment Variables**: Must redeploy after adding/changing them

**API Errors**: Data files are included in the repository, should work automatically

## Need Help?

1. Check deployment logs in Vercel dashboard
2. View function logs for API errors
3. Create issue at: https://github.com/dbbuilder/PSHCommitteeSite/issues