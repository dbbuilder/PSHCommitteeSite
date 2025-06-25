/**
 * Test helper utilities for PSH Committee Site
 * Contains common functions used across multiple test files
 */

import { expect } from '@playwright/test';

/**
 * Admin credentials for testing
 */
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

/**
 * Test data constants
 */
export const TEST_DATA = {
  blogPost: {
    title: 'Test Blog Post',
    author: 'Test Author',
    content: '# Test Content\n\nThis is a test blog post with **markdown** content.',
    excerpt: 'This is a test excerpt'
  },
  event: {
    title: 'Test Event',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    time: '14:00',
    location: 'Test Location',
    description: 'This is a test event description'
  },
  contactForm: {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message from the contact form.'
  }
};
/**
 * Login to admin panel
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function loginAsAdmin(page) {
  await page.goto('/admin/login');
  await page.fill('input[name="username"]', ADMIN_CREDENTIALS.username);
  await page.fill('input[name="password"]', ADMIN_CREDENTIALS.password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('/admin/dashboard');
  await expect(page.locator('h1')).toContainText('Admin Dashboard');
}

/**
 * Logout from admin panel
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function logout(page) {
  await page.click('text=Logout');
  await page.waitForURL('/admin/login');
}

/**
 * Wait for page to be fully loaded
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}
/**
 * Check if mobile menu is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>}
 */
export async function isMobileMenuVisible(page) {
  const mobileMenu = page.locator('nav.flex.flex-col').first();
  return await mobileMenu.isVisible();
}

/**
 * Open mobile menu
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function openMobileMenu(page) {
  const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
  await hamburgerButton.click();
  
  // Wait for menu animation
  await page.waitForTimeout(300);
}

/**
 * Close mobile menu by clicking outside
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function closeMobileMenuByClickingOutside(page) {
  // Click on the body element outside the menu
  await page.click('body', { position: { x: 10, y: 10 } });
  
  // Wait for menu animation
  await page.waitForTimeout(300);
}
/**
 * Fill contact form
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} formData - Form data to fill
 */
export async function fillContactForm(page, formData = TEST_DATA.contactForm) {
  await page.fill('input[name="name"]', formData.name);
  await page.fill('input[name="email"]', formData.email);
  await page.fill('input[name="subject"]', formData.subject);
  await page.fill('textarea[name="message"]', formData.message);
}

/**
 * Create a test blog post
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} postData - Blog post data
 */
export async function createBlogPost(page, postData = TEST_DATA.blogPost) {
  await page.goto('/admin/blog/new');
  await page.fill('input[name="title"]', postData.title);
  await page.fill('input[name="author"]', postData.author);
  await page.fill('textarea[name="excerpt"]', postData.excerpt);
  await page.fill('textarea[name="content"]', postData.content);
  await page.click('button:has-text("Create Post")');
  
  // Wait for success message
  await expect(page.locator('text=Blog post created successfully')).toBeVisible();
}
/**
 * Create a test event
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} eventData - Event data
 */
export async function createEvent(page, eventData = TEST_DATA.event) {
  await page.goto('/admin/events/new');
  await page.fill('input[name="title"]', eventData.title);
  await page.fill('input[name="date"]', eventData.date);
  await page.fill('input[name="time"]', eventData.time);
  await page.fill('input[name="location"]', eventData.location);
  await page.fill('textarea[name="description"]', eventData.description);
  await page.click('button:has-text("Create Event")');
  
  // Wait for success message
  await expect(page.locator('text=Event created successfully')).toBeVisible();
}

/**
 * Common viewport sizes for testing
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 }
};

/**
 * Check if element is in viewport
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @returns {Promise<boolean>}
 */
export async function isElementInViewport(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}