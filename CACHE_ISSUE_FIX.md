# 🚨 Important: Deploy & Clear Cache

## The Issue
You're seeing the old version of the test page without the username field. The updated file has the username field, but you need to:

1. **Deploy the Changes** (if not done yet)
2. **Clear Browser Cache** or use hard refresh

## Quick Fix Options

### Option 1: Use the New Test Page (V2)
I've created a new version with better visibility:
- **URL**: https://psh-committee-site.vercel.app/upload-test-v2.html

### Option 2: Deploy and Hard Refresh
```bash
# Deploy the changes
cd d:\dev2\pshcommitteesite
git add -A
git commit -m "Fix upload test page - add username field"
git push

# Wait for deployment to complete (2-3 minutes)

# Then in your browser:
# Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

### Option 3: Manual Login Test
If the test page still doesn't work, you can test manually:

1. Open browser developer tools (F12)
2. Go to Console tab
3. Run this code:
```javascript
// Login request
fetch('https://psh-committee-site.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'PSH@dm1n!'
  }),
})
.then(res => res.json())
.then(data => {
  console.log('Login response:', data);
  if (data.token) {
    window.authToken = data.token;
    console.log('Token saved to window.authToken');
  }
});
```

## Login Credentials
- **Username**: `admin`
- **Password**: `PSH@dm1n!`

## What's in the Updated Files

### `/upload-test.html` (Original - Updated)
- Added username input field
- Fixed login request to send both username and password

### `/upload-test-v2.html` (New Version)
- Clearer layout with labels
- Debug info section
- Better error messages
- Shows page version

Try the V2 version first - it should work immediately after deployment!