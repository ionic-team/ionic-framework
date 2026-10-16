import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The tab bar starts following a page once the page is visible, so wait
 * for the content to be set up before scrolling it.
 */
const scrollToBottom = async (content: Locator) => {
  await expect(content).toHaveClass(/content-tab-bar-hide-scroll-partner/);
  await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
};

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tab-bar: scroll-effect-hide-tabs'), () => {
    test('should hide the tab bar when scrolling down the first tab', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await scrollToBottom(page.locator('ion-tab[tab="tab-one"] ion-content'));

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should hide the tab bar when scrolling down after switching tabs', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await page.click('ion-tab-button[tab="tab-two"]');
      await expect(page.locator('ion-tab[tab="tab-two"]')).toBeVisible();

      await scrollToBottom(page.locator('ion-tab[tab="tab-two"] ion-content'));

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should not hide the tab bar on a page that can go back', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');
      const pageOneContent = page.locator('page-one ion-content');

      await expect(pageOneContent).toHaveClass(/content-tab-bar-hide-scroll-partner/);

      await page.click('#push-page-two');
      await expect(page.locator('page-two ion-content')).toBeVisible();

      // The tab bar stopped following the first page and does not follow the pushed page
      await expect(pageOneContent).not.toHaveClass(/content-tab-bar-hide-scroll-partner/);
      await expect(page.locator('page-two ion-content')).not.toHaveClass(/content-tab-bar-hide-scroll-partner/);

      await page.locator('page-two ion-content').evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should show the tab bar and hide it again when going back to the root page', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await scrollToBottom(page.locator('page-one ion-content'));
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);

      await page.locator('ion-nav').evaluate((el: HTMLIonNavElement) => el.push('page-two'));
      await expect(page.locator('page-two ion-content')).toBeVisible();
      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);

      await page.locator('ion-nav').evaluate((el: HTMLIonNavElement) => el.pop());
      await expect(page.locator('page-two')).toHaveCount(0);

      // The first page keeps its scroll position, so start from the top again
      const content = page.locator('page-one ion-content');
      await expect(content).toHaveClass(/content-tab-bar-hide-scroll-partner/);
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      // Scrolls in the same frame are handled as one, so wait for the scroll to be handled
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await scrollToBottom(content);
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should hide the tab bar on a page that can go back when tabBarScrollEffect is true', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await page.click('#push-page-three');
      await expect(page.locator('page-three ion-content')).toBeVisible();

      await scrollToBottom(page.locator('page-three ion-content'));

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should not hide the tab bar on a root page when tabBarScrollEffect is false', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await page.click('ion-tab-button[tab="tab-three"]');
      await expect(page.locator('ion-tab[tab="tab-three"]')).toBeVisible();

      // The tab bar stopped following the first tab and does not follow this one
      await expect(page.locator('ion-tab[tab="tab-one"] ion-content')).not.toHaveClass(
        /content-tab-bar-hide-scroll-partner/
      );

      await page
        .locator('ion-tab[tab="tab-three"] ion-content')
        .evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should update the tab bar when tabBarScrollEffect changes', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('page-one ion-content');

      await scrollToBottom(content);
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);

      await content.evaluate((el: HTMLIonContentElement) => (el.tabBarScrollEffect = false));

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
      await expect(content).not.toHaveClass(/content-tab-bar-hide-scroll-partner/);

      await content.evaluate((el: HTMLIonContentElement) => (el.tabBarScrollEffect = undefined));

      await expect(content).toHaveClass(/content-tab-bar-hide-scroll-partner/);
    });

    test('should follow the content when the tabs are in a page that is not visible yet', async ({ page }) => {
      // Frameworks render the page that contains the tabs as invisible until it transitions in
      await page.setContent(
        `
          <ion-app>
            <div class="ion-page ion-page-invisible">
              <ion-tabs>
                <ion-tab tab="tab-one">
                  <ion-content>
                    <div style="height: 3000px">Tab One</div>
                  </ion-content>
                </ion-tab>
                <ion-tab-bar slot="bottom" scroll-effect="hide">
                  <ion-tab-button tab="tab-one">
                    <ion-label>Tab One</ion-label>
                  </ion-tab-button>
                </ion-tab-bar>
              </ion-tabs>
            </div>
          </ion-app>
        `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await scrollToBottom(page.locator('ion-content'));

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should show the tab bar when switching to another tab', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await scrollToBottom(page.locator('ion-tab[tab="tab-one"] ion-content'));
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);

      // The hidden tab bar cannot be interacted with, so switch tabs programmatically
      await page.locator('ion-tabs').evaluate((el: HTMLIonTabsElement) => el.select('tab-two'));

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should stop hiding the tab bar when the scroll effect is removed', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide-tabs', config);

      const tabBar = page.locator('ion-tab-bar');

      await scrollToBottom(page.locator('ion-tab[tab="tab-one"] ion-content'));
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);

      await tabBar.evaluate((el: HTMLIonTabBarElement) => (el.scrollEffect = undefined));

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
      await expect(tabBar).not.toHaveAttribute('inert');
    });
  });
});
