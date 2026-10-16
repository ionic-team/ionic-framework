import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('header: scroll-effect-hide with a large title'), () => {
    test('should show the main header and its title before scrolling', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide-condense', config);

      await expect(page.locator('#mainHeader')).toHaveCSS('opacity', '1');
      await expect(page.locator('#mainHeader ion-title')).toHaveCSS('opacity', '1');
    });

    test('should not collapse the large title into the header that hides', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide-condense', config);

      const largeTitleHeader = page.locator('#largeTitleHeader');
      const content = page.locator('ion-content');

      await expect(content).toHaveClass(/content-header-hide-scroll-partner/);
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToPoint(0, 100, 0));
      await page.locator('#mainHeader.header-scroll-hidden').waitFor();

      // The large title scrolls away with the content instead of being replaced by the title in the header
      await expect(largeTitleHeader).not.toHaveClass(/header-collapse-condense-inactive/);
      await expect(largeTitleHeader.locator('ion-title')).toHaveCSS('visibility', 'visible');
    });
  });
});
