import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

// Tests for ion-nav used in ion-router

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('nav: routing'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/nav/test/routing', config);
    });

    test('should render the root component', async ({ page }) => {
      const pageRoot = page.locator('page-root');

      await expect(pageRoot).toBeVisible();
    });

    test.describe('pushing a new page', () => {
      test('should render the pushed component', async ({ page }) => {
        const pageRoot = page.locator('page-root');
        const pageOne = page.locator('page-one');
        const pageTwo = page.locator('page-two');

        const pageOneButton = page.locator('ion-button:has-text("Go to Page One")');
        const pageTwoButton = page.locator('ion-button:has-text("Go to Page Two")');

        await pageOneButton.click();
        await page.waitForChanges();

        await expect(pageOne).toBeVisible();
        // Pushing a new page should hide the previous page
        await expect(pageRoot).not.toBeVisible();
        await expect(pageRoot).toHaveCount(1);

        await pageTwoButton.click();
        await page.waitForChanges();

        await expect(pageTwo).toBeVisible();
        // Pushing a new page should hide the previous page
        await expect(pageOne).not.toBeVisible();
        await expect(pageOne).toHaveCount(1);
      });

      test('should render the back button', async ({ page }) => {
        const pageOneButton = page.locator('ion-button:has-text("Go to Page One")');
        const pageOneBackButton = page.locator('page-one ion-back-button');

        await pageOneButton.click();
        await page.waitForChanges();

        await expect(pageOneBackButton).toBeVisible();
      });
    });

    test('back button should pop to the previous page', async ({ page }) => {
      const pageRoot = page.locator('page-root');
      const pageOne = page.locator('page-one');

      const pageOneButton = page.locator('ion-button:has-text("Go to Page One")');
      const pageOneBackButton = page.locator('page-one ion-back-button');

      await pageOneButton.click();
      await page.waitForChanges();

      await pageOneBackButton.click();
      await page.waitForChanges();

      await expect(pageRoot).toBeVisible();
      // Popping a page should remove it from the DOM
      await expect(pageOne).toHaveCount(0);
    });

    test.describe('pushing multiple pages', () => {
      test('should keep previous pages in the DOM', async ({ page }) => {
        const pageRoot = page.locator('page-root');
        const pageOne = page.locator('page-one');
        const pageTwo = page.locator('page-two');
        const pageThree = page.locator('page-three');

        const pageOneButton = page.locator('ion-button:has-text("Go to Page One")');
        const pageTwoButton = page.locator('ion-button:has-text("Go to Page Two")');
        const pageThreeButton = page.locator('ion-button:has-text("Go to Page Three")');

        await pageOneButton.click();
        await page.waitForChanges();

        await expect(pageRoot).toHaveCount(1);
        await expect(pageOne).toBeVisible();

        await pageTwoButton.click();
        await page.waitForChanges();

        await expect(pageRoot).toHaveCount(1);
        await expect(pageOne).toHaveCount(1);
        await expect(pageTwo).toBeVisible();

        await pageThreeButton.click();
        await page.waitForChanges();

        await expect(pageRoot).toHaveCount(1);
        await expect(pageOne).toHaveCount(1);
        await expect(pageTwo).toHaveCount(1);
        await expect(pageThree).toBeVisible();
      });
    });
  });
});
