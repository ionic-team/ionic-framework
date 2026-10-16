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
      // A footer that is out of view stays reachable for keyboard and screen reader users
      await expect(footer).not.toHaveAttribute('inert');
      await expect(footer).not.toHaveAttribute('aria-hidden');

      // Verify the footer is visually off-screen via transform
      const transform = await footer.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
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
    test('should move out of view with the scroll, pixel by pixel', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        const scrollEl = await el.getScrollElement();

        for (let i = 0; i < 4; i++) {
          scrollEl.scrollTop += 5;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      });

      // Scrolling 20px moves the footer 20px out of view
      await expect.poll(() => footer.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(20);
    });
    test('should fade out while it moves out of view', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      await expect(footer).toHaveCSS('opacity', '1');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-footer.footer-scroll-hidden').waitFor();

      // It could come to rest in front of another bar, such as a tab bar, so it cannot stay visible
      await expect(footer).toHaveCSS('opacity', '0');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await page.locator('ion-footer:not(.footer-scroll-hidden)').waitFor();

      await expect(footer).toHaveCSS('opacity', '1');
    });
    test('should show again when an element in it receives focus', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      // The footer needs an element that can be focused
      await footer.evaluate((el) => {
        const toolbar = el.querySelector('ion-toolbar')!;
        toolbar.insertAdjacentHTML(
          'beforeend',
          '<ion-buttons slot="end"><ion-button>Action</ion-button></ion-buttons>'
        );
      });

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-footer.footer-scroll-hidden').waitFor();

      // Keyboard users cannot scroll back quickly, so focus has to bring it back
      await page.locator('ion-footer ion-button button').first().focus();

      await expect(footer).not.toHaveClass(/footer-scroll-hidden/);
      await expect
        .poll(() => footer.evaluate((el) => el.style.getPropertyValue('--internal-scroll-hide-offset')))
        .toBe('0px');
    });

    test('should not show again when scrolling back slowly while an element in it is not focused', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-effect-hide', config);

      const footer = page.locator('ion-footer');
      const content = page.locator('ion-content');

      // The footer needs an element that can be focused
      await footer.evaluate((el) => {
        const toolbar = el.querySelector('ion-toolbar')!;
        toolbar.insertAdjacentHTML(
          'beforeend',
          '<ion-buttons slot="end"><ion-button>Action</ion-button></ion-buttons>'
        );
      });

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-footer.footer-scroll-hidden').waitFor();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        const scrollEl = await el.getScrollElement();

        for (let i = 0; i < 20; i++) {
          scrollEl.scrollTop -= 2;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      });

      await expect(footer).toHaveClass(/footer-scroll-hidden/);
    });
  });
});
