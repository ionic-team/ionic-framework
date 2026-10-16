import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tab-bar: scroll-effect-fade'), () => {
    test('should have the scroll-effect-fade class when scrollEffect is set to fade', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-fade', config);

      const tabBar = page.locator('ion-tab-bar');
      await expect(tabBar).toHaveClass(/tab-bar-scroll-effect-fade/);
    });

    test('should fade out the background when the content is scrolled to the end', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-fade', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content');

      // Initially, the background is visible
      await expect.poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--opacity-scale'))).toBe('1');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

      await expect.poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--opacity-scale'))).toBe('0');
    });

    test('should fade the background back in when scrolling away from the end', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-fade', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await expect.poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--opacity-scale'))).toBe('0');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));

      await expect.poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--opacity-scale'))).toBe('1');
    });

    test('should not fade the tab buttons', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-fade', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await expect.poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--opacity-scale'))).toBe('0');

      const background = tabBar.locator('.tab-bar-background');
      await expect(background).toHaveCSS('opacity', '0');
      await expect(tabBar).toHaveCSS('opacity', '1');

      // The tab buttons do not paint a background of their own, since it would cover the faded one
      await expect(tabBar.locator('ion-tab-button').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    });
  });
});
