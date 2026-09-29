import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('header: scroll-effect-fade'), () => {
    test('should have the fade class on the header', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-fade', config);

      const header = page.locator('ion-header');
      await expect(header).toHaveClass(/header-collapse-fade/);
    });

    test('should fade in toolbar background on scroll', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-fade', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      // Initially, opacity-scale should be 0 (toolbar background hidden)
      const initialOpacity = await header.evaluate((el: HTMLElement) => el.style.getPropertyValue('--opacity-scale'));
      expect(initialOpacity).toBe('0');

      // Scroll to bottom — opacity-scale should be 1 (toolbar background visible)
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      const scrolledOpacity = await header.evaluate((el: HTMLElement) => el.style.getPropertyValue('--opacity-scale'));
      expect(scrolledOpacity).toBe('1');
    });

    test('should work when scrollEffect is set as a property', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-fade', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      // Remove the attribute and set via JS property to simulate framework binding
      await header.evaluate((el: any) => {
        el.removeAttribute('scroll-effect');
        el.scrollEffect = 'fade';
      });

      await page.waitForChanges();

      await expect(header).toHaveClass(/header-collapse-fade/);

      const initialOpacity = await header.evaluate((el: HTMLElement) => el.style.getPropertyValue('--opacity-scale'));
      expect(initialOpacity).toBe('0');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      const scrolledOpacity = await header.evaluate((el: HTMLElement) => el.style.getPropertyValue('--opacity-scale'));
      expect(scrolledOpacity).toBe('1');
    });
  });
});
