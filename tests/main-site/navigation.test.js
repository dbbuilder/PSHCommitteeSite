/**
 * Navigation Tests for PSH Committee Site
 * Tests desktop and mobile navigation functionality
 */

import { test, expect } from '@playwright/test';
import { 
  openMobileMenu, 
  isMobileMenuVisible, 
  closeMobileMenuByClickingOutside,
  VIEWPORTS,
  waitForPageLoad 
} from '../utils/test-helpers';

test.describe('Desktop Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should display all navigation links', async ({ page }) => {
    const navLinks = ['Home', 'About', 'Calendar', 'Blog', 'Resources', 'Contact'];
    
    for (const linkText of navLinks) {
      const link = page.locator(`nav a:has-text("${linkText}")`).first();
      await expect(link).toBeVisible();
    }
  });

  test('should navigate to correct pages when clicking links', async ({ page }) => {
    const navigationTests = [
      { link: 'About', url: '/about', heading: 'About' },
      { link: 'Calendar', url: '/calendar', heading: 'Calendar' },
      { link: 'Blog', url: '/blog', heading: 'Blog' },
      { link: 'Resources', url: '/resources', heading: 'Resources' },
      { link: 'Contact', url: '/contact', heading: 'Contact' }
    ];
    for (const navTest of navigationTests) {
      await page.click(`nav a:has-text("${navTest.link}")`);
      await waitForPageLoad(page);
      await expect(page).toHaveURL(navTest.url);
      await expect(page.locator('h1')).toContainText(navTest.heading);
    }
  });

  test('should highlight active page in navigation', async ({ page }) => {
    // Navigate to About page
    await page.goto('/about');
    await waitForPageLoad(page);
    
    // Check that About link has active styling
    const aboutLink = page.locator('nav a:has-text("About")').first();
    await expect(aboutLink).toHaveClass(/text-wa-green/);
    await expect(aboutLink).toHaveClass(/border-b-2/);
    
    // Check that other links don't have active styling
    const homeLink = page.locator('nav a:has-text("Home")').first();
    await expect(homeLink).not.toHaveClass(/border-b-2/);
  });

  test('should show hover effects on navigation links', async ({ page }) => {
    const blogLink = page.locator('nav a:has-text("Blog")').first();
    
    // Hover over the link
    await blogLink.hover();
    
    // Note: Testing hover states can be tricky with Playwright
    // We're mainly checking that the hover action doesn't cause errors
    await expect(blogLink).toBeVisible();
  });
});
test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should show hamburger menu button on mobile', async ({ page }) => {
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(hamburgerButton).toBeVisible();
    
    // Desktop navigation should be hidden
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
  });

  test('should toggle mobile menu when clicking hamburger button', async ({ page }) => {
    // Initially menu should be closed
    let isVisible = await isMobileMenuVisible(page);
    expect(isVisible).toBe(false);
    
    // Open menu
    await openMobileMenu(page);
    isVisible = await isMobileMenuVisible(page);
    expect(isVisible).toBe(true);
    
    // Close menu by clicking hamburger again
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await hamburgerButton.click();
    await page.waitForTimeout(300);
    isVisible = await isMobileMenuVisible(page);
    expect(isVisible).toBe(false);
  });

  test('should close mobile menu when clicking outside', async ({ page }) => {
    // Open menu
    await openMobileMenu(page);
    let isVisible = await isMobileMenuVisible(page);
    expect(isVisible).toBe(true);
    
    // Click outside to close
    await closeMobileMenuByClickingOutside(page);
    isVisible = await isMobileMenuVisible(page);
    expect(isVisible).toBe(false);
  });

  test('should navigate to pages from mobile menu', async ({ page }) => {
    await openMobileMenu(page);
    
    // Click on About link
    await page.click('nav.flex.flex-col a:has-text("About")');
    await waitForPageLoad(page);
    
    // Should navigate to About page and close menu
    await expect(page).toHaveURL('/about');
    const isVisible = await isMobileMenuVisible(page);
    expect(isVisible).toBe(false);
  });

  test('should show active page indicator in mobile menu', async ({ page }) => {
    await page.goto('/blog');
    await waitForPageLoad(page);
    await openMobileMenu(page);
    
    // Blog link should have active styling
    const blogLink = page.locator('nav.flex.flex-col a:has-text("Blog")');
    await expect(blogLink).toHaveClass(/bg-wa-green\/20/);
    
    // Should show checkmark icon for active page
    const checkIcon = blogLink.locator('svg');
    await expect(checkIcon).toBeVisible();
  });

  test('should have smooth animations for menu open/close', async ({ page }) => {
    const mobileNav = page.locator('div.md\\:hidden.absolute').first();
    
    // Check initial state
    await expect(mobileNav).toHaveClass(/opacity-0/);
    await expect(mobileNav).toHaveClass(/invisible/);
    
    // Open menu and check animation classes
    await openMobileMenu(page);
    await expect(mobileNav).toHaveClass(/opacity-100/);
    await expect(mobileNav).toHaveClass(/visible/);
    await expect(mobileNav).toHaveClass(/translate-y-0/);
  });
});

test.describe('Responsive Navigation', () => {
  test('should switch between desktop and mobile navigation at breakpoint', async ({ page }) => {
    await page.goto('/');
    
    // Start with desktop viewport
    await page.setViewportSize(VIEWPORTS.desktop);
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    const hamburger = page.locator('button[aria-label="Toggle navigation menu"]');
    
    await expect(desktopNav).toBeVisible();
    await expect(hamburger).not.toBeVisible();
    
    // Switch to tablet viewport (at breakpoint)
    await page.setViewportSize({ width: 767, height: 1024 });
    await expect(desktopNav).not.toBeVisible();
    await expect(hamburger).toBeVisible();
  });
});
test.describe('Navigation Accessibility', () => {
  test('should have proper ARIA attributes', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]');
    
    // Check initial aria-expanded state
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    
    // Open menu and check aria-expanded changes
    await hamburgerButton.click();
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Tab through navigation links
    await page.keyboard.press('Tab'); // Skip to first nav item
    
    // Press Tab multiple times to navigate through links
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // This is a basic check - for comprehensive accessibility testing,
    // consider using axe-core or similar tools
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)'); // White text
    }
  });
});