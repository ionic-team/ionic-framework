import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The focus indicator UI differs between iOS and MD, so these visual tests run
 * in both modes. Direction does not affect the indicator, so only LTR is run.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: focus visual'), () => {
    test('should render focus indicator when unchecked', async ({ page, pageUtils }) => {
      // `ion-app` is required so `startFocusVisible` runs and applies the
      // `ion-focused` class on keyboard focus, which drives the focus indicator.
      await page.setContent(
        `
        <style>
          #container {
            width: fit-content;
            padding: 10px;
          }
        </style>

        <ion-app>
          <div id="container">
            <ion-radio-group>
              <ion-radio value="a">Unchecked</ion-radio>
            </ion-radio-group>
          </div>
        </ion-app>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      // The focus listeners attach asynchronously, so the first Tab can miss
      // them. Retry until `ion-focused` sticks before taking the snapshot.
      await expect(async () => {
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await pageUtils.pressKeys('Tab');
        await expect(radio).toHaveClass(/ion-focused/, { timeout: 250 });
      }).toPass({ timeout: 5000 });

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`radio-focus`));
    });

    test('should render focus indicator when checked', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <style>
          #container {
            width: fit-content;
            padding: 10px;
          }
        </style>

        <ion-app>
          <div id="container">
            <ion-radio-group value="a">
              <ion-radio value="a">Checked</ion-radio>
            </ion-radio-group>
          </div>
        </ion-app>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      // The focus listeners attach asynchronously, so the first Tab can miss
      // them. Retry until `ion-focused` sticks before taking the snapshot.
      await expect(async () => {
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await pageUtils.pressKeys('Tab');
        await expect(radio).toHaveClass(/ion-focused/, { timeout: 250 });
      }).toPass({ timeout: 5000 });

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`radio-focus-checked`));
    });
  });
});
