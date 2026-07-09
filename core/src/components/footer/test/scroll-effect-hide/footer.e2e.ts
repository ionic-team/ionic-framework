import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('footer: scroll-effect-hide'), () => {
    test('should have the scroll-effect-hide class when scrollEffect is set to hide', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      await expect(footer).toHaveClass(/footer-scroll-effect-hide/);
    });

    test('should hide the footer when scrolling down', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      await expect(footer).not.toHaveClass(/footer-scroll-hidden/);

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-footer.footer-scroll-hidden').waitFor();

      await expect(footer).toHaveClass(/footer-scroll-hidden/);
      await expect(footer).toHaveAttribute('inert', '');
    });

    test('should show the footer again when scrolling back to the top', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-footer.footer-scroll-hidden').waitFor();

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await page.locator('ion-footer:not(.footer-scroll-hidden)').waitFor();

      await expect(footer).not.toHaveClass(/footer-scroll-hidden/);
      await expect(footer).not.toHaveAttribute('inert');
    });
  });
});
