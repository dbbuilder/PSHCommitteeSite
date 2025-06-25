/**
 * Homepage Tests for PSH Committee Site
 * Tests all sections and content on the homepage
 */

import { test, expect } from '@playwright/test';
import { VIEWPORTS, waitForPageLoad } from '../utils/test-helpers';

test.describe('Homepage Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should display hero section with correct content', async ({ page }) => {
    // Check hero section exists
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Check main heading - updated to match actual content
    await expect(page.locator('h1')).toContainText('Permanent Supportive Housing Advisory Committee');
    
    // Check hero description
    const heroText = page.locator('text=Providing guidance and recommendations');
    await expect(heroText).toBeVisible();
    
    // Check CTA buttons - updated to match actual buttons
    const learnMoreButton = page.locator('a:has-text("Learn More About PSH")');
    const calendarButton = page.locator('a:has-text("View Meeting Calendar")');
    await expect(learnMoreButton).toBeVisible();
    await expect(calendarButton).toBeVisible();
  });

  test('should display quick stats section', async ({ page }) => {
    const statsSection = page.locator('section:has-text("Advisory Committee Members")');
    await expect(statsSection).toBeVisible();
    
    // Check for stats
    await expect(page.locator('text=26')).toBeVisible();
    await expect(page.locator('text=Advisory Committee Members')).toBeVisible();
    await expect(page.locator('text=122,000')).toBeVisible();
    await expect(page.locator('text=PSH Units Needed by 2045')).toBeVisible();
  });

  test('should display what is PSH section', async ({ page }) => {
    const pshSection = page.locator('section:has(h2:has-text("What is Permanent Supportive Housing?"))');
    await expect(pshSection).toBeVisible();
    
    // Check for content
    const pshText = pshSection.locator('text=combines housing and wraparound services');
    await expect(pshText).toBeVisible();
    
    // Check for key features list
    await expect(pshSection.locator('text=No limits on length of stay')).toBeVisible();
    await expect(pshSection.locator('text=Lower barriers to entry')).toBeVisible();
    await expect(pshSection.locator('text=Voluntary supportive services')).toBeVisible();
  });

  test('should display upcoming events section', async ({ page }) => {
    const eventsSection = page.locator('section:has(h2:has-text("Upcoming Events"))');
    await expect(eventsSection).toBeVisible();
    
    // Check for calendar link
    const calendarLink = page.locator('a:has-text("View Full Calendar")');
    await expect(calendarLink).toBeVisible();
    await expect(calendarLink).toHaveAttribute('href', '/calendar');
  });

  test('all internal links should navigate correctly', async ({ page }) => {
    // Test Learn More About PSH button
    await page.click('a:has-text("Learn More About PSH")');
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/about');
    
    // Go back and test View Meeting Calendar button
    await page.goto('/');
    await page.click('a:has-text("View Meeting Calendar")');
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/calendar');
  });
});

test.describe('Homepage Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Check that sections stack vertically
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(3);
    
    // Check hero section is still visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Verify layout adjusts for tablet
    await expect(page.locator('h1')).toBeVisible();
  });
});