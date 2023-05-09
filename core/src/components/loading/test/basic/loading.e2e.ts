import { expect } from '@playwright/test';
import type { E2EPage, ScreenshotFn } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const runVisualTest = async (page: E2EPage, selector: string, screenshot: ScreenshotFn, screenshotModifier: string) => {
  const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');

  await page.click(selector);

  await ionLoadingDidPresent.next();

  await expect(page).toHaveScreenshot(screenshot(`loading-${screenshotModifier}-diff`));
};

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('loading: basic'), () => {
    test('should open a basic loader', async ({ page }) => {
      await page.goto('/src/components/loading/test/basic', config);
      const loading = page.locator('ion-loading');
      const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidPresent');

      await runVisualTest(page, '#basic-loading', screenshot, 'basic');

      await loading.evaluate((el: HTMLIonLoadingElement) => el.dismiss());

      await ionLoadingDidDismiss.next();

      await expect(loading).toBeHidden();
    });
  });
});

/**
 * These behaviors do not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('loading: variants rendering'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/loading/test/basic', config);
    });
    test('should open a loader with long text', async ({ page }) => {
      await runVisualTest(page, '#long-content-loading', screenshot, 'long-content');
    });
    test('should open a loader with no spinner', async ({ page }) => {
      await runVisualTest(page, '#no-spinner-loading', screenshot, 'no-spinner');
    });
    test('should open a loader with a custom class', async ({ page }) => {
      await runVisualTest(page, '#custom-class-loading', screenshot, 'custom-class');
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  /**
   * Translucency is only available on iOS.
   */
  test.describe(title('loading: translucent rendering'), () => {
    test('should open a translucent loader', async ({ page }) => {
      await page.goto('/src/components/loading/test/basic', config);
      await runVisualTest(page, '#translucent-loading', screenshot, 'translucent');
    });
  });

  /**
   * These behaviors do not vary across modes/directions
   */
  test.describe(title('loading: focus trapping'), () => {
    test('it should trap focus in the loader', async ({ page, browserName }) => {
      await page.goto('/src/components/loading/test/basic', config);

      const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');

      await page.click('#html-content-loading');

      await ionLoadingDidPresent.next();

      const button = page.locator('ion-loading ion-button');

      if (browserName === 'webkit') {
        await page.keyboard.down('Alt');
      }

      await page.keyboard.press('Tab');

      await expect(button).toBeFocused();

      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');

      await expect(button).toBeFocused();

      await page.keyboard.press('Tab');

      if (browserName === 'webkit') {
        await page.keyboard.up('Alt');
      }

      await expect(button).toBeFocused();
    });
  });
});
