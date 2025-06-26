# ✅ CORRECT LOGIN CREDENTIALS

## The Issue Was: Wrong Password in Documentation

The documentation incorrectly stated the password was `PSH@dm1n!`, but the actual default password is `admin123`.

## Correct Credentials:
- **Username**: `admin`
- **Password**: `admin123`

## Test It Now:

### Option 1: Browser Console
```javascript
fetch('https://psh-committee-site.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
}).then(r => r.json()).then(console.log);
```

### Option 2: Updated Test Page
Deploy and visit: https://psh-committee-site.vercel.app/upload-test-v2.html

### Option 3: Direct Admin Login
Visit: https://psh-committee-site.vercel.app/admin
- Username: admin
- Password: admin123

## Why This Happened

The codebase has this default password hash:
```javascript
// From lib/auth.js
// Default password: 'admin123' - CHANGE IN PRODUCTION
// This hash is for the password 'admin123'
password: process.env.ADMIN_PASSWORD_HASH || '$2a$10$jJ1cEK.rhssUnFSIvYGld.TmDcH6d/wxIMNtTRlI3jOWYfbXPIfvu'
```

The hash `$2a$10$jJ1cEK.rhssUnFSIvYGld.TmDcH6d/wxIMNtTRlI3jOWYfbXPIfvu` is for the password `admin123`.

## Files Updated:
- `/public/upload-test.html` - Fixed password
- `/public/upload-test-v2.html` - Fixed password
- `/scripts/test-upload.js` - Fixed password

## Deploy the Fix:
```bash
cd d:\dev2\pshcommitteesite
git add -A
git commit -m "Fix password in test files - use correct default admin123"
git push
```

## Important Note
In production, you should:
1. Change the password from the default `admin123`
2. Set `ADMIN_PASSWORD_HASH` environment variable with a bcrypt hash of your new password
3. Never use default credentials in production