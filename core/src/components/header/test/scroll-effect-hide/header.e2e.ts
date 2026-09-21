import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('header: scroll-effect-hide'), () => {
    test('should have the scroll-effect-hide class when scrollEffect is set to hide', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      await expect(header).toHaveClass(/header-scroll-effect-hide/);
    });

    test('should hide the header when scrolling down', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      await expect(header).not.toHaveClass(/header-scroll-hidden/);

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-header.header-scroll-hidden').waitFor();

      await expect(header).toHaveClass(/header-scroll-hidden/);
      await expect(header).toHaveAttribute('inert', '');

      // Verify the header is visually off-screen via transform
      const transform = await header.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    });

    test('should show the header again when scrolling back to the top', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-header.header-scroll-hidden').waitFor();

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await page.locator('ion-header:not(.header-scroll-hidden)').waitFor();

      await expect(header).not.toHaveClass(/header-scroll-hidden/);
      await expect(header).not.toHaveAttribute('inert');
    });
  });
});
