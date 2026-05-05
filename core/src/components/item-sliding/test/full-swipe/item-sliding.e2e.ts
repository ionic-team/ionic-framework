import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * When an item has at least one expandable option and the user swipes
 * beyond the threshold (or with sufficient velocity), the item slides
 * off-screen, fires ionSwipe, and returns to its closed position.
 */

// Full animation cycle duration (100ms expand + 250ms off-screen + 300ms delay + 250ms return)
const FULL_ANIMATION_MS = 1100;

configs({ modes: ['ios', 'md'], directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: full swipe'), () => {
    test('should fire ionSwipe when expandable option is swiped fully (end side)', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable End (Swipe Left)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option expandable="true">Delete</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      const dragByX = config.direction === 'rtl' ? 190 : -190;

      await dragElementBy(item, page, dragByX);
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });

    test('should fire ionSwipe when expandable option is swiped fully (start side)', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable Start (Swipe Right)</ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option expandable="true">Archive</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const dragByX = config.direction === 'rtl' ? -190 : 190;

      await dragElementBy(item, page, dragByX);
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });

    test('should return to closed state after full swipe animation completes', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable End (Swipe Left)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option expandable="true">Delete</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
        config
      );

      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const dragByX = config.direction === 'rtl' ? 190 : -190;

      await dragElementBy(item, page, dragByX);
      await page.waitForTimeout(FULL_ANIMATION_MS);

      const openAmount = await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount());
      expect(openAmount).toBe(0);
    });

    test('should NOT trigger full swipe animation for non-expandable options', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Non-Expandable (Should Show Options)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option>Edit</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const dragByX = config.direction === 'rtl' ? 180 : -180;

      await dragElementBy(item, page, dragByX);

      await ionSwipe.next();
      await page.waitForChanges();

      // The full swipe animation closes the item (openAmount === 0) after completing.
      // For a non-expandable item, no animation runs and the item stays open at optsWidth.
      const openAmount = await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount());
      expect(Math.abs(openAmount)).toBeGreaterThan(0);
    });

    test('should fire ionSwipe when non-expandable options are swiped past the threshold', async ({ page }) => {
      await page.setContent(
        `
            <ion-item-sliding>
              <ion-item>
                <ion-label>Non-Expandable (Should Show Options)</ion-label>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option>Edit</ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const dragByX = config.direction === 'rtl' ? 190 : -190;

      await dragElementBy(item, page, dragByX);
      await ionSwipe.next();

      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });
  });
});

/**
 * Test for Ionic theme that has a different full swipe animation behavior.
 */
configs({ modes: ['ionic-md'], directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: full swipe'), () => {
    test('should fire ionSwipe when expandable option is swiped fully (end side)', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable End (Swipe Left)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option expandable="true">Delete</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
         `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const box = (await item.boundingBox())!;
      const y = box.y + box.height / 2;

      // 1) Peek open (distance-based; moderate steps is fine)
      const peek = config.direction === 'rtl' ? 120 : -120;
      await dragElementBy(item, page, peek);

      // 2) Fast flick in the same direction as “full swipe”
      const startX = config.direction === 'rtl' ? box.x + 40 : box.x + box.width - 40;
      const endX = config.direction === 'rtl' ? box.x + box.width - 40 : box.x + 40;
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 2 }); // try 1–3; lower = faster
      await page.mouse.up();
      await ionSwipe.next();
      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });

    test('should fire ionSwipe when expandable option is swiped fully (start side)', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable Start (Swipe Right)</ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option expandable="true">Archive</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
         `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const box = (await item.boundingBox())!;
      const y = box.y + box.height / 2;

      // 1) Peek open (distance-based; moderate steps is fine)
      const peek = config.direction === 'rtl' ? -120 : 120;
      await dragElementBy(item, page, peek);

      // 2) Fast flick in the same direction as “full swipe”
      const startX = config.direction === 'rtl' ? box.x + box.width - 40 : box.x + 40;
      const endX = config.direction === 'rtl' ? box.x + 40 : box.x + box.width - 40;
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 2 });
      await page.mouse.up();
      await ionSwipe.next();
      expect(ionSwipe).toHaveReceivedEventTimes(1);
    });

    test('should return to closed state after full swipe animation completes', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable End (Swipe Left)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option expandable="true">Delete</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
         `,
        config
      );

      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const box = (await item.boundingBox())!;
      const y = box.y + box.height / 2;

      // 1) Peek open (distance-based; moderate steps is fine)
      const peek = config.direction === 'rtl' ? -120 : 120;
      await dragElementBy(item, page, peek);

      // 2) Fast flick in the same direction as “full swipe”
      const startX = config.direction === 'rtl' ? box.x + box.width - 40 : box.x + 40;
      const endX = config.direction === 'rtl' ? box.x + 40 : box.x + box.width - 40;
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 2 });
      await page.mouse.up();
      await page.waitForTimeout(FULL_ANIMATION_MS);

      const openAmount = await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount());
      expect(openAmount).toBe(0);
    });

    test('should NOT trigger full swipe animation for non-expandable options', async ({ page }) => {
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Non-Expandable (Should Show Options)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option>Edit</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
        config
      );
      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
      const dragByX = config.direction === 'rtl' ? 180 : -180;

      await dragElementBy(item, page, dragByX);
      await page.waitForChanges();

      expect(ionSwipe).toHaveReceivedEventTimes(0);

      const openAmount = await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount());

      expect(Math.abs(openAmount)).toBeGreaterThan(0);
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
      await page.setContent(
        `
          <ion-item-sliding>
            <ion-item>
              <ion-label>Expandable End (Swipe Left)</ion-label>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option expandable="true">Delete</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
        config
      );

      const ionSwipe = await page.spyOnEvent('ionSwipe');
      const item = page.locator('ion-item-sliding');
      await expect(item).toBeVisible();
      await page.waitForChanges();
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
