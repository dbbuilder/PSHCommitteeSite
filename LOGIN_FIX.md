# ✅ Login Fix - Username Required

## The Issue
The login endpoint requires both `username` and `password`, but the test page was only sending `password`.

## The Fix
Updated the test page and scripts to include username:
- Default username: `admin`
- Default password: `PSH@dm1n!`

## Files Updated
1. `/public/upload-test.html` - Added username field
2. `/scripts/test-upload.js` - Added username to login request

## Deploy the Fix
```bash
cd d:\dev2\pshcommitteesite
git add -A
git commit -m "Fix login - add username field to test tools"
git push
```

## Test After Deployment

1. Visit: https://psh-committee-site.vercel.app/upload-test.html
2. Login with:
   - Username: `admin`
   - Password: `PSH@dm1n!`
3. Continue with upload testing

## For API Testing
When calling the login endpoint, always include both fields:
```json
{
  "username": "admin",
  "password": "PSH@dm1n!"
}
```

This should resolve the 400 error and allow you to proceed with upload testing!