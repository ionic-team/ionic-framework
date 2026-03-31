import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * Full swipe animation behavior is mode-independent but
 * child components (ion-item-options, ion-item-option) have
 * mode-specific styling, so we test across all modes.
 *
 * When an item has at least one expandable option and the user swipes
 * beyond the threshold (or with sufficient velocity), the item slides
 * off-screen, fires ionSwipe, and returns to its closed position.
 */

// Full animation cycle duration (100ms expand + 250ms off-screen + 300ms delay + 250ms return)
const FULL_ANIMATION_MS = 1100;

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: full swipe'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/full-swipe`, config);
    });

    test('should fire ionSwipe when expandable option is swiped fully (end side)', async ({ page }) => {
      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('#expandable-end');
      const dragByX = config.direction === 'rtl' ? 190 : -190;

      await dragElementBy(item, page, dragByX);
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });

    test('should fire ionSwipe when expandable option is swiped fully (start side)', async ({ page }) => {
      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('#expandable-start');
      const dragByX = config.direction === 'rtl' ? -190 : 190;

      await dragElementBy(item, page, dragByX);
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });

    test('should return to closed state after full swipe animation completes', async ({ page }) => {
      const item = page.locator('#expandable-end');

      const dragByX = config.direction === 'rtl' ? 190 : -190;

      await dragElementBy(item, page, dragByX);
      await page.waitForTimeout(FULL_ANIMATION_MS);
      await page.waitForChanges();

      const openAmount = await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount());
      expect(openAmount).toBe(0);
    });

    test('should NOT trigger full swipe animation for non-expandable options', async ({ page }) => {
      const item = page.locator('#non-expandable');
      const dragByX = config.direction === 'rtl' ? 180 : -180;

      await dragElementBy(item, page, dragByX);

      // Wait long enough for the full swipe animation to complete if it had triggered
      await page.waitForTimeout(FULL_ANIMATION_MS);

      // The full swipe animation closes the item (openAmount === 0) after completing.
      // For a non-expandable item, no animation runs and the item stays open at optsWidth.
      const openAmount = await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount());
      expect(Math.abs(openAmount)).toBeGreaterThan(0);
    });

    test('should fire ionSwipe when non-expandable options are swiped past the threshold', async ({ page }) => {
      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('#non-expandable');
      const dragByX = config.direction === 'rtl' ? 190 : -190;

      await dragElementBy(item, page, dragByX);
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });
  });
});

/**
 * Velocity-based trigger: a fast short swipe should trigger the full animation
 * even if the raw distance alone wouldn't exceed the threshold.
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'], directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: full swipe velocity'), () => {
    test('should trigger full swipe animation with fast velocity', async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/full-swipe`, config);

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('#expandable-end');
      const box = (await item.boundingBox())!;

      // Few steps = high velocity gesture
      const startX = config.direction === 'rtl' ? box.x + 30 : box.x + box.width - 10;
      const endX = config.direction === 'rtl' ? box.x + box.width - 10 : box.x + 30;
      const startY = box.y + box.height / 2;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, startY, { steps: 3 });
      await page.mouse.up();
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });
  });
});
