# API Fixes Documentation

## Issues Fixed

### 1. **405 Method Not Allowed Errors**
- **Problem**: Admin API endpoints (`/api/admin/blog` and `/api/admin/events`) were returning 405 errors when POST requests were made
- **Root Cause**: Multiple issues:
  - Middleware chain was not properly handling CORS headers when authentication failed
  - Data structure mismatch between API expectations and actual JSON files

### 2. **Data Structure Mismatch**
- **Problem**: The JSON data files had wrapper objects (`{ posts: [...] }` and `{ events: [...] }`) but the API was expecting arrays directly
- **Solution**: Updated the read/write helper functions to handle the correct data structure

## Files Modified

### 1. `/lib/middleware.js`
- Fixed CORS middleware to ensure headers are set for all responses, including authentication failures
- Improved error handling in authentication middleware
- Ensured proper middleware chaining

### 2. `/pages/api/admin/blog.js`
- Updated `readBlogData()` to handle the `{ posts: [...] }` structure
- Updated `writeBlogData()` to maintain the wrapper structure
- Fixed ID generation to use timestamps for uniqueness
- Added debug logging for troubleshooting
- Fixed ID comparison to handle both string and numeric IDs

### 3. `/pages/api/admin/events.js`
- Updated `readEventsData()` to handle the `{ events: [...] }` structure
- Updated `writeEventsData()` to maintain the wrapper structure
- Fixed ID generation to use timestamps for uniqueness
- Added debug logging for troubleshooting
- Fixed ID comparison to handle both string and numeric IDs

### 4. Created `/pages/api/admin/test-auth.js`
- Simple endpoint to test authentication without CRUD operations
- Useful for debugging authentication issues

### 5. Created `/scripts/test-api.js`
- Comprehensive test script to verify all API endpoints locally
- Tests authentication, CRUD operations for both blog and events

## Testing the Fixes

### Local Testing
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run the test script:
   ```bash
   node scripts/test-api.js
   ```

3. The script will test:
   - Authentication (login)
   - Blog CRUD operations (Create, Read, Update, Delete)
   - Events CRUD operations

### Manual Testing
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Try creating a new blog post at `/admin/blog/new`
4. Try creating a new event at `/admin/events/new`

## Deployment Considerations

### For Vercel Deployment
1. **Environment Variables**: Ensure these are set in Vercel:
   - `JWT_SECRET` - Secret key for JWT tokens
   - `ADMIN_USERNAME` - Admin username (optional, defaults to 'admin')
   - `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password

2. **Data Persistence**: The current implementation uses file-based storage which may not persist across deployments on Vercel. Consider:
   - Using a database (PostgreSQL, MongoDB, etc.)
   - Using Vercel KV or other persistent storage solutions
   - Setting up proper data volumes if self-hosting

3. **CORS Configuration**: The current CORS setup allows all origins (`*`). For production:
   - Update to specific allowed origins
   - Configure based on your deployment domain

### Security Recommendations
1. Change the default admin password immediately
2. Use strong JWT secret in production
3. Implement rate limiting for API endpoints
4. Add input validation and sanitization
5. Consider implementing refresh tokens
6. Add audit logging for admin actions

## Troubleshooting

### If 405 errors persist:
1. Check browser console for the exact request being made
2. Verify the authentication token is being sent in headers
3. Check Vercel function logs for any errors
4. Ensure the API routes are properly deployed

### If authentication fails:
1. Verify the admin credentials match what's in the environment
2. Check that the JWT_SECRET is consistent between local and production
3. Ensure the Authorization header format is correct: `Bearer <token>`

### If data isn't persisting:
1. Check file permissions in the deployment environment
2. Verify the `data` directory exists and is writable
3. Consider switching to a database for production use

## Next Steps
1. Test the fixes locally using the provided test script
2. Deploy to a staging environment first
3. Monitor the Vercel function logs during testing
4. Consider implementing a proper database solution for production