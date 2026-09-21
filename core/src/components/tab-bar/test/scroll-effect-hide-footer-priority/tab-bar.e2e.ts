import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * When ion-tab-bar is nested inside ion-footer, the footer controls
 * hide behavior. The tab bar's scrollEffect prop is ignored regardless
 * of whether the parent footer has a scrollEffect set.
 */
configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tab-bar: scroll-effect-hide footer priority'), () => {
    test('should not hide the tab bar when nested inside a footer without scrollEffect', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-footer-priority', config);

      const tabBar = page.locator('#tabBar');
      const content = page.locator('ion-content');

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      // Tab bar should still not be hidden — footer takes priority
      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
      await expect(tabBar).not.toHaveAttribute('inert');
    });
  });
});
