# PSH Committee Site - Comprehensive Test Plan

## Test Execution Order & Priority

### Phase 1: Navigation & Core Functionality ✅ (Partially Complete)
**Status**: Initial tests run, critical fixes applied
- [x] Desktop navigation display
- [x] Mobile hamburger menu functionality 
- [x] Blog page heading fix applied
- [x] Active state detection fix applied
- [ ] Safari mobile menu close issue
- [ ] Edge mobile viewport issue
- [ ] Firefox performance investigation

### Phase 2: Page Content & Load Tests (Next Priority)
**Goal**: Ensure all pages load correctly with expected content

#### 2.1 Homepage Tests
- [ ] Hero section displays correctly
- [ ] All sections load (mission, about, contact)
- [ ] Images load properly
- [ ] Links work correctly
- [ ] Responsive layout on all viewports

#### 2.2 Individual Page Tests
- [ ] About page - committee member cards display
- [ ] Calendar page - events load and display
- [ ] Blog page - posts list correctly
- [ ] Individual blog posts - markdown renders
- [ ] Resources page - documents listed
- [ ] Contact page - form displays

#### 2.3 Error Handling
- [ ] 404 page displays for invalid routes
- [ ] API errors handled gracefully
- [ ] Loading states work correctly
### Phase 3: Forms & Interactive Elements
**Goal**: Validate all user interactions work correctly

#### 3.1 Contact Form Tests
- [ ] Form validation (required fields)
- [ ] Email validation
- [ ] Success message displays
- [ ] Form data saves correctly
- [ ] Form resets after submission
- [ ] Error handling for failed submissions

#### 3.2 Navigation Interactions
- [ ] Smooth scroll for anchor links
- [ ] External links open in new tab
- [ ] Logo click returns to home

### Phase 4: Admin Panel Tests
**Goal**: Ensure admin functionality works securely

#### 4.1 Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Session persistence
- [ ] Logout functionality
- [ ] Protected route redirection

#### 4.2 Blog Management
- [ ] Create new blog post
- [ ] Edit existing post
- [ ] Delete post
- [ ] Draft/publish toggle
- [ ] Markdown preview
- [ ] Tag management
- [ ] Image upload (if applicable)

#### 4.3 Event Management  
- [ ] Create new event
- [ ] Edit event details
- [ ] Delete event
- [ ] Date/time validation
- [ ] Location with map preview

#### 4.4 Submissions Management
- [ ] View contact submissions
- [ ] Mark as read/unread
- [ ] Search/filter submissions
- [ ] Export functionality (if available)
### Phase 5: Responsive Design Tests
**Goal**: Ensure site works on all devices

#### 5.1 Viewport Tests
- [ ] Mobile (375px) - iPhone SE
- [ ] Mobile (414px) - iPhone 12 Pro
- [ ] Tablet (768px) - iPad
- [ ] Desktop (1280px) - Standard
- [ ] Wide (1920px) - Full HD

#### 5.2 Layout Adjustments
- [ ] Navigation collapses at correct breakpoint
- [ ] Grid layouts stack on mobile
- [ ] Images scale appropriately
- [ ] Text remains readable
- [ ] Touch targets are adequate size

### Phase 6: Accessibility Tests
**Goal**: Ensure site is usable by everyone

#### 6.1 Screen Reader Compatibility
- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] ARIA labels for interactive elements
- [ ] Form labels associated correctly
- [ ] Skip navigation links

#### 6.2 Keyboard Navigation
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] All interactive elements reachable
- [ ] Escape key closes modals
- [ ] Enter key submits forms

#### 6.3 Visual Accessibility
- [ ] Color contrast meets WCAG AA
- [ ] Text is resizable
- [ ] No color-only information
- [ ] Focus indicators have sufficient contrast
### Phase 7: Performance Tests
**Goal**: Ensure fast, efficient site performance

#### 7.1 Page Load Metrics
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

#### 7.2 Resource Optimization
- [ ] Images properly optimized
- [ ] JavaScript bundle size reasonable
- [ ] CSS minimized
- [ ] Proper caching headers
- [ ] No memory leaks

### Phase 8: Cross-Browser Testing
**Goal**: Ensure compatibility across browsers

#### 8.1 Browser Matrix
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Test Implementation Guide

### Creating New Tests
1. Use the existing test structure in `tests/` directory
2. Import helpers from `test-helpers.js`
3. Follow naming convention: `feature.test.js`
4. Group related tests with `test.describe()`

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/main-site/pages.test.js

# Run with UI mode for debugging
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium
```

### Test Data Management
- Use fixtures in `test-helpers.js` for consistent test data
- Clean up test data after each test
- Use unique identifiers to avoid conflicts

## Success Criteria
- All tests pass on CI/CD pipeline
- No flaky tests (tests that randomly fail)
- Test execution time < 5 minutes
- Code coverage > 80%
- All critical user paths tested

## Next Steps
1. Implement page content tests (Phase 2)
2. Fix remaining browser-specific issues
3. Set up CI/CD pipeline with GitHub Actions
4. Create dashboard for test results
5. Schedule regular test runs