import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

/**
 * Safe area tests only check top and bottom edges. RTL checks are not required here.
 */
configs({ directions: ['ltr'] }).forEach(({ config, title, screenshot }) => {
  test.describe(title('app: safe-area'), () => {
    const testOverlay = async (page: E2EPage, trigger: string, event: string, screenshotModifier: string) => {
      const presentEvent = await page.spyOnEvent(event);

      await page.click(trigger);
      await presentEvent.next();

      // Sometimes the inner content takes a frame or two to render
      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`app-${screenshotModifier}-diff`));
    };

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/app/test/safe-area`, config);
    });

    test.describe(title('Ionic safe area variables'), () => {
      test.beforeEach(async ({ page }) => {
        const htmlTag = page.locator('html');
        const hasSafeAreaClass = await htmlTag.evaluate((el) => el.classList.contains('safe-area'));

        expect(hasSafeAreaClass).toBe(true);
      });

      test('should not have visual regressions with action sheet', async ({ page }) => {
        await testOverlay(page, '#show-action-sheet', 'ionActionSheetDidPresent', 'action-sheet');
      });
      test('should not have visual regressions with menu', async ({ page }) => {
        await testOverlay(page, '#show-menu', 'ionDidOpen', 'menu');
      });
      test('should not have visual regressions with picker', async ({ page }) => {
        await testOverlay(page, '#show-picker', 'ionPickerDidPresent', 'picker');
      });
      test('should not have visual regressions with toast', async ({ page }) => {
        await testOverlay(page, '#show-toast', 'ionToastDidPresent', 'toast');
      });
    });

    test.describe(title('Capacitor safe area variables'), () => {
      test('should use safe-area-inset vars when safe-area class is defined', async ({ page }) => {
        await page.evaluate(() => {
          const html = document.documentElement;

          // Remove the safe area class
          html.classList.remove('safe-area');

          // Set the safe area inset variables
          html.style.setProperty('--safe-area-inset-top', '10px');
          html.style.setProperty('--safe-area-inset-bottom', '20px');
          html.style.setProperty('--safe-area-inset-left', '30px');
          html.style.setProperty('--safe-area-inset-right', '40px');
        });

        const top = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-top').trim()
        );
        const bottom = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-bottom').trim()
        );
        const left = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-left').trim()
        );
        const right = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-right').trim()
        );

        expect(top).toBe('10px');
        expect(bottom).toBe('20px');
        expect(left).toBe('30px');
        expect(right).toBe('40px');
      });
    });
  });
});
