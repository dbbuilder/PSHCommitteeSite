# Fixed: Documents Count on Dashboard

## The Issue
The dashboard was showing the correct count for blog posts and events, but showing 0 for documents.

## The Cause
API response format inconsistency:
- **Blog API** returns: `{ success: true, data: [...] }`
- **Events API** returns: `{ success: true, data: [...] }`
- **Documents API** returns: `{ success: true, documents: [...] }` ← Different key!

The dashboard was looking for `documentsData.data` but should look for `documentsData.documents`.

## The Fix
**File**: `/pages/admin/dashboard.js`

Changed:
```javascript
const totalDocuments = documentsData.success && documentsData.data ? documentsData.data.length : 0
```

To:
```javascript
const totalDocuments = documentsData.success && documentsData.documents ? documentsData.documents.length : 0
```

## Deploy the Fix

```bash
cd d:\dev2\pshcommitteesite
git add -A
git commit -m "Fix documents count on dashboard - use correct response key"
git push
```

## After Deployment

The dashboard will now show the correct count for:
- ✅ Blog Posts (was already working)
- ✅ Events (was already working)
- ✅ Documents (now fixed!)
- ✅ Submissions (should be working)

## Note for Future

Ideally, all admin APIs should return data in a consistent format:
```javascript
{ success: true, data: [...] }
```

But changing the documents API now might break other parts of the application that expect the `documents` key, so I just fixed the dashboard to handle the current format.