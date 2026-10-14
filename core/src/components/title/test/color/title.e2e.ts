import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Color doesn't change with direction, so this only runs ltr.
 */
configs({
  modes: ['ionic-md', 'md', 'ios'],
  directions: ['ltr'],
  palettes: ['light', 'dark', 'high-contrast', 'high-contrast-dark'],
}).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: color'), () => {
    test('should apply the color to the title text', async ({ page }) => {
      await page.goto('/src/components/title/test/color', config);
      const wrapper = page.locator('#header-wrapper');

      await expect(wrapper).toHaveScreenshot(screenshot(`title-color`));
    });
  });
});
