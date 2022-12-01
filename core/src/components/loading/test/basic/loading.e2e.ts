import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('loading: basic', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/loading/test/basic', config);
    });
    test.describe('loading: visual regression tests', () => {
      const runVisualTest = async (page: E2EPage, selector: string, screenshotModifier: string) => {
        const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
        const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidPresent');

        await page.click(selector);

        await ionLoadingDidPresent.next();

        expect(await page.screenshot()).toMatchSnapshot(
          `loading-${screenshotModifier}-diff-${page.getSnapshotSettings()}.png`
        );

        const loading = await page.locator('ion-loading');
        await loading.evaluate((el: HTMLIonLoadingElement) => el.dismiss());

        await ionLoadingDidDismiss.next();

        await expect(loading).toBeHidden();
      };
      test(title('should open a basic loader'), async ({ page }) => {
        await runVisualTest(page, '#basic-loading', 'basic');
      });
      test(title('should open a loader with long text'), async ({ page }) => {
        await runVisualTest(page, '#long-content-loading', 'long-content');
      });
      test(title('should open a loader with no spinner'), async ({ page }) => {
        await runVisualTest(page, '#no-spinner-loading', 'no-spinner');
      });
      test(title('should open a translucent loader'), async ({ page }) => {
        await runVisualTest(page, '#translucent-loading', 'translucent');
      });
      test(title('should open a loader with a custom class'), async ({ page }) => {
        await runVisualTest(page, '#custom-class-loading', 'custom-class');
      });
      test(title('should open a loader with html content'), async ({ page }) => {
        await runVisualTest(page, '#html-content-loading', 'html-content');
      });
    });
    test.describe('loading: html attributes', () => {
      test(title('it should pass html attributes to the loader'), async ({ page }) => {
        const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');

        await page.click('#basic-loading');

        await ionLoadingDidPresent.next();

        const loading = await page.locator('ion-loading');
        await expect(loading).toHaveAttribute('data-testid', 'basic-loading');
      });
    });
    test.describe('loading: focus trapping', () => {
      test(title('it should trap focus in the loader'), async ({ page, browserName }) => {
        const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');

        await page.click('#html-content-loading');

        await ionLoadingDidPresent.next();

        const button = await page.locator('ion-loading ion-button');

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
});
