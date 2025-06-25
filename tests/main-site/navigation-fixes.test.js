/**
 * Quick validation test for navigation fixes
 */

import { test, expect } from '@playwright/test';
import { VIEWPORTS, waitForPageLoad } from '../utils/test-helpers';

test.describe('Navigation Fix Validation', () => {
  test('blog page should have correct heading', async ({ page }) => {
    await page.goto('/blog');
    await waitForPageLoad(page);
    
    // Check that the heading is now "Blog" not "News & Updates"
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('active page highlighting should work correctly', async ({ page }) => {
    await page.goto('/about');
    await waitForPageLoad(page);
    
    // About link should have border-b-2 (active indicator)
    const aboutLink = page.locator('nav a:has-text("About")').first();
    await expect(aboutLink).toHaveClass(/border-b-2/);
    
    // Home link should NOT have border-b-2
    const homeLink = page.locator('nav a:has-text("Home")').first();
    await expect(homeLink).not.toHaveClass(/border-b-2/);
  });
});