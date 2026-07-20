import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(
  ({ title, screenshot, config }) => {
    test.describe(title('header: scroll-effect-condense without large title'), () => {
      test('should not activate condense effect without a large title', async ({ page }) => {
        await page.goto('/src/components/header/test/scroll-effect-condense-no-large-title', config);

        const condenseHeader = page.locator('#condenseHeader');

        // Without a large title, the condense effect should not activate.
        // The header should get the hidden class instead.
        await expect(condenseHeader).toHaveClass(/header-collapse-condense-hidden/);
      });

      test('should keep main header visible without a large title', async ({ page }) => {
        await page.goto('/src/components/header/test/scroll-effect-condense-no-large-title', config);

        const mainHeader = page.locator('#smallTitleHeader');

        // The main header should remain visible (not hidden by the :has() ghost-hide rule)
        await expect(mainHeader).toBeVisible();
        await expect(mainHeader).toHaveScreenshot(screenshot(`header-condense-no-large-title-main-visible-diff`));
      });

      test('should not have visual regressions when no large title is present', async ({ page }) => {
        await page.goto('/src/components/header/test/scroll-effect-condense-no-large-title', config);

        await expect(page).toHaveScreenshot(screenshot(`header-condense-no-large-title-initial-diff`));
      });

      test('should not collapse on scroll without a large title', async ({ page }) => {
        await page.goto('/src/components/header/test/scroll-effect-condense-no-large-title', config);

        const mainHeader = page.locator('#smallTitleHeader');
        const content = page.locator('ion-content');

        await content.evaluate(async (el: HTMLIonContentElement) => {
          await el.scrollToBottom();
        });

        // Wait a moment for any potential scroll handlers to fire
        await page.waitForTimeout(500);

        // The main header should still be visible after scrolling
        await expect(mainHeader).toBeVisible();
      });
    });
  }
);
