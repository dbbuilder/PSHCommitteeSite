# PSH Advisory Committee Website - TODO

## ✅ COMPLETED - API Fix (June 25, 2025)

### Fixed Admin API 405 Errors
- [x] **Fixed Blog API 405 Error**: `/api/admin/blog` now accepts POST requests correctly
  - [x] Updated middleware to handle CORS headers properly
  - [x] Fixed data structure handling (posts wrapper)
  - [x] Fixed ID generation and comparison
- [x] **Fixed Events API 405 Error**: `/api/admin/events` now accepts POST requests correctly
  - [x] Updated middleware to handle CORS headers properly
  - [x] Fixed data structure handling (events wrapper)
  - [x] Fixed ID generation and comparison
- [x] **Created Test Infrastructure**:
  - [x] Added `/api/admin/test-auth` endpoint for debugging
  - [x] Created comprehensive test script (`/scripts/test-api.js`)
  - [x] Documented all fixes in `API_FIXES.md`
  - [x] Created quick deployment guide in `QUICK_DEPLOY_FIX.md`

### 🚀 Next Steps for API
- [ ] Deploy fixes to Vercel
- [ ] Test admin functionality on production
- [ ] Consider database migration for data persistence
- [ ] Implement proper error logging
- [ ] Add rate limiting for security

---

## 🚨 IMMEDIATE PRIORITY - Test Results & Fixes

### ✅ Phase 1: Hamburger Navigation Status
**GOOD NEWS: The hamburger menu is working correctly!**
- [x] Header already has `relative` positioning
- [x] Mobile menu has proper z-index (z-50)
- [x] Menu has smooth transition animations
- [x] Menu closes when clicking outside (works on most browsers)
- [x] Menu toggle functionality works well
- [ ] Safari-specific issue: Menu doesn't close after navigation
- [ ] Edge mobile viewport: Hamburger button not visible
### 🔴 Critical Issues Found (From Test Results - June 25, 2025)
- [ ] **Blog Page Title Mismatch**: Page shows "News & Updates" instead of "Blog"
  - All navigation tests failing due to this content issue
  - Fix: Update page heading in `/pages/blog/index.js` to match expected "Blog"
- [ ] **Active Page Detection**: Test expects exact class matching but hover states interfere
  - Fix: Update navigation tests to check for specific active state classes

### 🔴 Homepage Content Mismatch (From Test Results - June 25, 2025)
- [ ] **Homepage Heading**: Shows "Permanent Supportive Housing Advisory Committee" but tests expect "Washington State PSH Advisory Committee"
- [ ] **Missing Homepage Sections**: Tests expect these sections but they don't exist:
  - [ ] "Our Mission" section
  - [ ] "About the Committee" section with "Meet Our Members" link
  - [ ] "Recent Updates" section with "View All Updates" link
  - [ ] "Resources" section with "Browse Resources" link
  - [ ] "Get in Touch" contact section with email link
- [ ] **Existing Homepage Sections** (not tested):
  - Quick Stats section (26 members, 122,000 units needed, etc.)
  - What is PSH section
  - Upcoming Events section (✅ working correctly)
- [ ] **Decision Required**: Either update homepage to match tests OR update tests to match current homepage design
- [ ] **Mobile Safari**: Menu doesn't close after navigation
  - Add Safari-specific event handling in Header.js
  - Ensure route change listener works on Safari
- [ ] **Microsoft Edge Mobile**: Hamburger button not visible on mobile viewport
  - Check CSS media queries for Edge compatibility
  - Test responsive breakpoints on Edge
- [ ] **Firefox Performance**: Multiple tests timing out
  - Investigate page load performance on Firefox
  - Consider increasing test timeouts for Firefox
- [ ] **Mobile Safari Keyboard**: Focus indicators not visible
  - Add explicit `:focus` styles for mobile Safari

### Phase 2: Playwright Testing Status ✅
- [x] Playwright already installed and configured
- [x] Test directory structure created
- [x] Navigation tests written and executed
- [x] Test helpers and utilities in place
- [x] Multiple browser configurations set up
- [x] Initial test run completed (64/84 passed)
- [ ] Fix failing tests based on findings
- [ ] Add more comprehensive test coverage
### Phase 3: Test Implementation Progress

#### ✅ Completed Test Fixes (June 25, 2025)
- [x] Fixed blog page heading ("News & Updates" → "Blog")
- [x] Fixed active state detection test (check for border-b-2 instead of text-wa-green)
- [x] Verified fixes with quick validation tests (all passing)
- [x] Created comprehensive TEST_PLAN.md for remaining tests
- [x] Documented all test findings in TEST_RESULTS.md
- [x] Fixed Admin API 405 errors for blog and events

#### 🚧 In Progress - Browser-Specific Fixes
- [ ] **Safari Mobile Menu Fix**: Add explicit close on route change
  ```javascript
  // In Header.js useEffect for route changes
  router.events.on('routeChangeComplete', () => setIsMenuOpen(false))
  ```
- [ ] **Edge Mobile Viewport**: Check md:hidden breakpoint compatibility
- [ ] **Firefox Performance**: Increase timeout for Firefox tests in playwright.config.js
- [ ] **Safari Keyboard Navigation**: Add explicit focus styles

#### 📋 Next Immediate Tasks
1. [ ] Deploy API fixes to Vercel
2. [ ] Run full navigation test suite again to verify fixes
3. [ ] Implement page content tests (see TEST_PLAN.md Phase 2)
4. [ ] Create automated test report generation
5. [ ] Set up GitHub Actions for continuous testing

#### 3.2 Page Load Tests (Priority 2)
- [ ] Test all public pages load without errors
  - [ ] Homepage loads with all sections
  - [ ] About page displays committee info
  - [ ] Calendar page loads with events
  - [ ] Blog page shows post listings
  - [ ] Individual blog posts render correctly
  - [ ] Resources page displays documents
  - [ ] Contact form page loads properly
- [ ] Verify no 404 errors
- [ ] Check console for JavaScript errors
- [ ] Validate all images load correctly
#### 3.3 Form & Interactive Element Tests (Priority 3)
- [ ] Contact form functionality
  - [ ] Form validation works
  - [ ] reCAPTCHA loads (if configured)
  - [ ] Success message displays after submission
  - [ ] Form data is stored correctly
- [ ] Calendar interactions
  - [ ] Events display correctly
  - [ ] Event details modal works
  - [ ] Google Maps integration functions
- [ ] Document downloads work in Resources

#### 3.4 Admin Authentication Tests (Priority 4)
- [ ] Login page functionality
  - [ ] Valid credentials allow access
  - [ ] Invalid credentials show error
  - [ ] Session persistence works
  - [ ] Logout functionality works
- [ ] Protected route tests
  - [ ] Unauthenticated users redirected to login
  - [ ] Session expiration handled gracefully

#### 3.5 Admin CRUD Operation Tests (Priority 5)
- [x] Blog post management API fixed
  - [ ] Test create new blog post with all fields
  - [ ] Test edit existing blog post
  - [ ] Test delete blog post
  - [ ] Verify Markdown rendering
  - [ ] Verify slug generation
- [x] Event management API fixed
  - [ ] Test create new event with all details
  - [ ] Test edit event information
  - [ ] Test delete event
  - [ ] Test date/time handling
  - [ ] Verify location data saves correctly
- [ ] Contact submission viewing
  - [ ] List all submissions
  - [ ] View individual submission details
  - [ ] Mark submissions as read/resolved

## Future Enhancements (Lower Priority)
- [ ] Implement database solution for production data persistence
- [ ] Add audit logging for admin actions
- [ ] Implement rate limiting on API endpoints
- [ ] Add image upload functionality for blog posts
- [ ] Create member profile pages
- [ ] Add search functionality across site content
- [ ] Implement email notifications for new submissions
- [ ] Add analytics tracking
- [ ] Create API documentation
- [ ] Add unit tests for components
- [ ] Implement CI/CD pipeline