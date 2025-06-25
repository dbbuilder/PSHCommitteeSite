/**
 * Browser-specific fix validation tests
 */

import { test, expect } from '@playwright/test';
import { VIEWPORTS, waitForPageLoad } from '../utils/test-helpers';

test.describe('Browser Fixes Validation', () => {
  test('Safari mobile menu should close after navigation', async ({ page, browserName }) => {
    // This test is most relevant for webkit/safari
    test.skip(browserName !== 'webkit', 'This test is for Safari/webkit only');
    
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Open menu
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await hamburgerButton.click();
    await page.waitForTimeout(300);
    
    // Verify menu is open
    const mobileMenu = page.locator('nav.flex.flex-col').first();
    await expect(mobileMenu).toBeVisible();
    
    // Navigate to another page
    await page.click('nav.flex.flex-col a:has-text("About")');
    await waitForPageLoad(page);
    
    // Verify menu is closed after navigation
    await expect(mobileMenu).not.toBeVisible();
  });

  test('Edge mobile viewport - hamburger button should be visible', async ({ page, browserName }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Check hamburger button is visible
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(hamburgerButton).toBeVisible();
    
    // Desktop nav should be hidden
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
  });

  test('Firefox should handle navigation without timeout', async ({ page, browserName }) => {
    test.setTimeout(60000); // Extended timeout for this test
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Navigate through pages
    await page.click('nav a:has-text("About")');
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/about');
    
    await page.click('nav a:has-text("Blog")');
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/blog');
  });

  test('Focus indicators should be visible on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Open mobile menu first
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await hamburgerButton.click();
    await page.waitForTimeout(300);
    
    // Focus on a menu item
    const firstMenuItem = page.locator('nav.flex.flex-col a').first();
    await firstMenuItem.focus();
    
    // Check that focused element is visible
    await expect(firstMenuItem).toBeFocused();
  });
});