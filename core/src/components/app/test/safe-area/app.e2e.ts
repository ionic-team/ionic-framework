import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

/**
 * Safe area tests only check top and bottom edges. RTL checks are not required here.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ config, title, screenshot }) => {
    test.describe(
      title('app: safe-area'),
      () => {
        const testOverlay = async (
          page: E2EPage,
          trigger: string,
          event: string,
          screenshotModifier: string
        ) => {
          const presentEvent =
            await page.spyOnEvent(
              event
            );

          await page.click(trigger);
          await presentEvent.next();

          // Sometimes the inner content takes a frame or two to render
          await page.waitForChanges();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `app-${screenshotModifier}-diff`
            )
          );
        };
        test.beforeEach(
          async ({ page }) => {
            await page.goto(
              `/src/components/app/test/safe-area`,
              config
            );
          }
        );
        test('should not have visual regressions with action sheet', async ({
          page,
        }) => {
          await testOverlay(
            page,
            '#show-action-sheet',
            'ionActionSheetDidPresent',
            'action-sheet'
          );
        });
        test('should not have visual regressions with menu', async ({
          page,
        }) => {
          await testOverlay(
            page,
            '#show-menu',
            'ionDidOpen',
            'menu'
          );
        });
        test('should not have visual regressions with picker', async ({
          page,
        }) => {
          await testOverlay(
            page,
            '#show-picker',
            'ionPickerDidPresent',
            'picker'
          );
        });
        test('should not have visual regressions with toast', async ({
          page,
        }) => {
          await testOverlay(
            page,
            '#show-toast',
            'ionToastDidPresent',
            'toast'
          );
        });
      }
    );
  }
);
