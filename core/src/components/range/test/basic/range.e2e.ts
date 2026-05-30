import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/range/test/basic', config);
    });
    test('should render default range', async ({ page }) => {
      const range = page.locator('ion-range.default');
      await expect(range).toHaveScreenshot(screenshot(`range-default`));
    });
    test('should render dual knob range', async ({ page }) => {
      const range = page.locator('ion-range.dual-knobs');
      await expect(range).toHaveScreenshot(screenshot(`range-dual-knobs`));
    });
    test('should render range with ticks', async ({ page }) => {
      const range = page.locator('ion-range.ticks');
      await expect(range).toHaveScreenshot(screenshot(`range-ticks`));
    });
    test('should render pin', async ({ page }) => {
      const range = page.locator('ion-range.pin');
      const knob = range.locator('.range-knob-handle');

      // Force the pin to show
      await knob.evaluate((el: HTMLElement) => el.classList.add('ion-focused'));

      await expect(range).toHaveScreenshot(screenshot(`range-pin`));
    });
  });
});
