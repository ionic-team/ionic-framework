import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * As of Ionic 9, ion-nav is a standalone stack navigation component and no longer
 * integrates with ion-router. These tests verify that an ion-nav still manages its
 * own stack when an ion-router is present on the page, and that navigating the nav
 * never syncs to the router (the URL does not change).
 *
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('nav: routing'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/nav/test/routing', config);
    });

    test('should render the root component from the root property', async ({ page }) => {
      const pageRoot = page.locator('page-root');

      await expect(pageRoot).toBeVisible();
    });

    test('pushing a page should not update the URL', async ({ page }) => {
      const urlBefore = page.url();

      const pageOne = page.locator('page-one');
      const pageOneButton = page.locator('button:has-text("Go to Page One")');

      await pageOneButton.click();
      await page.waitForChanges();

      // The nav stack advances...
      await expect(pageOne).toBeVisible();
      // ...but the router is not involved, so the URL is unchanged.
      expect(page.url()).toBe(urlBefore);
    });

    test('back button should pop the nav stack without touching the URL', async ({ page }) => {
      const pageRoot = page.locator('page-root');
      const pageOne = page.locator('page-one');

      const pageOneButton = page.locator('button:has-text("Go to Page One")');
      const pageOneBackButton = page.locator('page-one ion-back-button');

      await pageOneButton.click();
      await page.waitForChanges();

      const urlAfterPush = page.url();

      await pageOneBackButton.click();
      await page.waitForChanges();

      await expect(pageRoot).toBeVisible();
      // Popping a page removes it from the DOM.
      await expect(pageOne).toHaveCount(0);
      // The router never observed the pop, so the URL is unchanged.
      expect(page.url()).toBe(urlAfterPush);
    });

    test('pushing multiple pages should keep previous pages in the DOM', async ({ page }) => {
      const pageRoot = page.locator('page-root');
      const pageOne = page.locator('page-one');
      const pageTwo = page.locator('page-two');

      const pageOneButton = page.locator('button:has-text("Go to Page One")');
      const pageTwoButton = page.locator('button:has-text("Go to Page Two")');

      await pageOneButton.click();
      await page.waitForChanges();

      await expect(pageRoot).toHaveCount(1);
      await expect(pageOne).toBeVisible();

      await pageTwoButton.click();
      await page.waitForChanges();

      await expect(pageRoot).toHaveCount(1);
      await expect(pageOne).toHaveCount(1);
      await expect(pageTwo).toBeVisible();
    });
  });
});
