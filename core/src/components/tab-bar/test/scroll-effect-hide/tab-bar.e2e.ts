import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

interface ScrollStep {
  /** Pixels to scroll. Positive scrolls down, negative scrolls back up. */
  distance: number;
  /** How many times the distance is scrolled. */
  count: number;
  /** Milliseconds between each scroll. */
  delay: number;
}

/**
 * Runs the scroll steps in a row inside of the page, so that the time between
 * the scrolls does not depend on the test runner. Returns how far the tab bar
 * is out of view after each step.
 */
const scrollAndMeasure = (page: Page, steps: ScrollStep[]) => {
  return page.evaluate(async (steps) => {
    const content = document.querySelector('ion-content') as HTMLIonContentElement;
    const tabBar = document.querySelector('ion-tab-bar') as HTMLElement;
    const scrollEl = await content.getScrollElement();
    const nextFrames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const offsets: number[] = [];
    for (const { distance, count, delay } of steps) {
      for (let i = 0; i < count; i++) {
        scrollEl.scrollTop += distance;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      await nextFrames();
      offsets.push(parseFloat(tabBar.style.getPropertyValue('--internal-scroll-hide-offset') || '0'));
    }
    return offsets;
  }, steps);
};

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
      const content = page.locator('ion-content');

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-tab-bar.tab-bar-scroll-hidden').waitFor();

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
      // A tab bar that is out of view stays reachable for keyboard and screen reader users
      await expect(tabBar).not.toHaveAttribute('inert');
      await expect(tabBar).not.toHaveAttribute('aria-hidden');

      // Verify the tab bar is visually off-screen via transform
      const transform = await tabBar.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    });

    test('should show the tab bar again when scrolling back to the top', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-tab-bar.tab-bar-scroll-hidden').waitFor();

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));
      await page.locator('ion-tab-bar:not(.tab-bar-scroll-hidden)').waitFor();

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
      await expect(tabBar).not.toHaveAttribute('inert');
    });
    test('should move out of view with the scroll, pixel by pixel', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const [afterFirst, afterSecond] = await scrollAndMeasure(page, [
        { distance: 5, count: 4, delay: 20 },
        { distance: 5, count: 4, delay: 20 },
      ]);

      expect(afterFirst).toBe(20);
      expect(afterSecond).toBe(40);
    });

    test('should not return when scrolling back slowly', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');

      // Scrolls 120px back at 0.1px per millisecond, however far, this is not a quick scroll back
      const [, , offsetAfterSlowScroll] = await scrollAndMeasure(page, [
        { distance: 400, count: 1, delay: 100 },
        { distance: 0, count: 1, delay: 300 },
        { distance: -2, count: 60, delay: 20 },
      ]);

      expect(offsetAfterSlowScroll).toBeGreaterThan(0);
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should return when scrolling back quickly', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');

      await scrollAndMeasure(page, [{ distance: 400, count: 1, delay: 300 }]);
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);

      const [offsetAfterQuickScroll] = await scrollAndMeasure(page, [{ distance: -100, count: 1, delay: 20 }]);

      expect(offsetAfterQuickScroll).toBe(0);
      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
    });

    test('should follow a slow scroll back while it is partly out of view', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      await scrollAndMeasure(page, [{ distance: 400, count: 1, delay: 300 }]);
      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
      const hideHeight = await tabBar.evaluate((el) =>
        parseFloat(el.style.getPropertyValue('--internal-tab-bar-hide-height'))
      );

      const [afterQuickScrollBack, afterScrollingForward, afterSlowScrollBack] = await scrollAndMeasure(page, [
        { distance: -30, count: 1, delay: 20 },
        { distance: 10, count: 1, delay: 20 },
        // 0.1px per millisecond is far below a quick scroll back
        { distance: -2, count: 5, delay: 20 },
      ]);

      expect(afterQuickScrollBack).toBe(hideHeight - 30);
      expect(afterScrollingForward).toBe(hideHeight - 20);
      expect(afterSlowScrollBack).toBe(hideHeight - 30);
    });

    test('should settle to the closest edge after scrolling stops', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');

      // Moves the tab bar out of view and brings back more than half of it, then stops scrolling
      await scrollAndMeasure(page, [{ distance: 400, count: 1, delay: 300 }]);
      await scrollAndMeasure(page, [{ distance: -40, count: 1, delay: 20 }]);

      await expect
        .poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--internal-scroll-hide-offset')))
        .toBe('0px');
    });
    test('should show again when an element in it receives focus', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content');

      // Tab buttons can only be focused when they have an href, like they do in the frameworks
      await page
        .locator('ion-tab-button')
        .evaluateAll((buttons) => buttons.forEach((button) => button.setAttribute('href', '#')));

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-tab-bar.tab-bar-scroll-hidden').waitFor();

      // Keyboard users cannot scroll back quickly, so focus has to bring it back
      await page.locator('ion-tab-button a').first().focus();

      await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
      await expect
        .poll(() => tabBar.evaluate((el) => el.style.getPropertyValue('--internal-scroll-hide-offset')))
        .toBe('0px');
    });

    test('should not show again when scrolling back slowly while an element in it is not focused', async ({ page }) => {
      await page.goto('/src/components/tab-bar/test/scroll-effect-hide', config);

      const tabBar = page.locator('ion-tab-bar');
      const content = page.locator('ion-content');

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.locator('ion-tab-bar.tab-bar-scroll-hidden').waitFor();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        const scrollEl = await el.getScrollElement();

        for (let i = 0; i < 20; i++) {
          scrollEl.scrollTop -= 2;
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      });

      await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);
    });
  });
});
