import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('content: auto offset'), () => {

    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/content/test/auto-offset`, config);
      await page.setIonViewport();
      await expect(page).toHaveScreenshot(screenshot(`content-auto-offset-initial`));
    });

    test('should update offsets when header height changes', async ({ page }) => {
      await page.goto(`/src/components/content/test/auto-offset`, config);
      await page.setIonViewport();

      const content = page.locator('ion-content');
      const before = await content.evaluate((el: HTMLElement) =>
        getComputedStyle(el).getPropertyValue('--offset-top')
      );

      await page.click('#expand-header-btn');

      await expect(content).not.toHaveCSS('--offset-top', before);

      await expect(page).toHaveScreenshot(screenshot(`content-auto-offset-header-updated`));
    });

    test('should update offsets when footer height changes', async ({ page }) => {
      await page.goto(`/src/components/content/test/auto-offset`, config);
      await page.setIonViewport();

      const content = page.locator('ion-content');
      const before = await content.evaluate((el: HTMLElement) =>
        getComputedStyle(el).getPropertyValue('--offset-bottom')
      );

      await page.click('#expand-footer-btn');

      await expect(content).not.toHaveCSS('--offset-bottom', before);

      const after = await content.evaluate((el: HTMLElement) =>
        getComputedStyle(el).getPropertyValue('--offset-bottom')
      );

      expect(after).not.toBe(before);

      await expect(page).toHaveScreenshot(screenshot(`content-auto-offset-footer-updated`));
    });

  });
});