import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('footer: scroll-effect-fade'), () => {
    test('should have the fade class on the footer', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-fade', config);

      const footer = page.locator('ion-footer');
      await expect(footer).toHaveClass(/footer-collapse-fade/);
    });

    test('should fade out toolbar background when scrolled to bottom', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-fade', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      // Initially, opacity-scale should be 1 (toolbar background visible)
      const initialOpacity = await footer.evaluate((el: HTMLElement) =>
        el.style.getPropertyValue('--opacity-scale')
      );
      expect(initialOpacity).toBe('1');

      // Scroll to bottom — opacity-scale should be 0 (toolbar background hidden)
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      const scrolledOpacity = await footer.evaluate((el: HTMLElement) =>
        el.style.getPropertyValue('--opacity-scale')
      );
      expect(scrolledOpacity).toBe('0');
    });
  });
});
