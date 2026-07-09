import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tab-bar: scroll-effect-hide'), () => {
    test('should have the scroll-effect-hide class when scrollEffect is set to hide', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      await expect(tabBar).toHaveClass(/tab-bar-scroll-effect-hide/);
    });

    test('should hide the tab bar when scrolling down', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content').first();

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-tab-bar.tab-bar-scroll-hidden').waitFor();

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
      await expect(tabBar).toHaveAttribute('inert', '');
    });

    test('should show the tab bar again when scrolling back to the top', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content').first();

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-tab-bar.tab-bar-scroll-hidden').waitFor();

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await page.locator('ion-tab-bar:not(.tab-bar-scroll-hidden)').waitFor();

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
      await expect(tabBar).not.toHaveAttribute('inert');
    });
  });
});
