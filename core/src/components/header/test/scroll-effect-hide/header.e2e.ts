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
      // A header that is out of view stays reachable for keyboard and screen reader users
      await expect(header).not.toHaveAttribute('inert');
      await expect(header).not.toHaveAttribute('aria-hidden');

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
    test('should move out of view with the scroll, pixel by pixel', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        const scrollEl = await el.getScrollElement();

        for (let i = 0; i < 4; i++) {
          scrollEl.scrollTop += 5;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      });

      // Scrolling 20px moves the header 20px out of view
      await expect.poll(() => header.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(-20);
    });
    test('should fade out while it moves out of view', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      await expect(header).toHaveCSS('opacity', '1');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-header.header-scroll-hidden').waitFor();

      // It could come to rest in front of another bar, such as a tab bar, so it cannot stay visible
      await expect(header).toHaveCSS('opacity', '0');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await page.locator('ion-header:not(.header-scroll-hidden)').waitFor();

      await expect(header).toHaveCSS('opacity', '1');
    });
    test('should show again when an element in it receives focus', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      // The header needs an element that can be focused
      await header.evaluate((el) => {
        const toolbar = el.querySelector('ion-toolbar')!;
        toolbar.insertAdjacentHTML(
          'beforeend',
          '<ion-buttons slot="end"><ion-button>Action</ion-button></ion-buttons>'
        );
      });

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-header.header-scroll-hidden').waitFor();

      // Keyboard users cannot scroll back quickly, so focus has to bring it back
      await page.locator('ion-header ion-button button').first().focus();

      await expect(header).not.toHaveClass(/header-scroll-hidden/);
      await expect
        .poll(() => header.evaluate((el) => el.style.getPropertyValue('--internal-scroll-hide-offset')))
        .toBe('0px');
    });

    test('should not show again when scrolling back slowly while an element in it is not focused', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-hide', config);

      const header = page.locator('ion-header');
      const content = page.locator('ion-content');

      // The header needs an element that can be focused
      await header.evaluate((el) => {
        const toolbar = el.querySelector('ion-toolbar')!;
        toolbar.insertAdjacentHTML(
          'beforeend',
          '<ion-buttons slot="end"><ion-button>Action</ion-button></ion-buttons>'
        );
      });

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-header.header-scroll-hidden').waitFor();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        const scrollEl = await el.getScrollElement();

        for (let i = 0; i < 20; i++) {
          scrollEl.scrollTop -= 2;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      });

      await expect(header).toHaveClass(/header-scroll-hidden/);
    });
  });
});
