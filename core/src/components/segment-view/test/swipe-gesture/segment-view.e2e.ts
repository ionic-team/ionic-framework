import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: swipe gesture'), () => {
    test('should allow swiping the segment view by default', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment-view>
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      await page.waitForChanges();

      const segmentView = page.locator('ion-segment-view');

      const allowsSwipe = await segmentView.evaluate((el: HTMLElement) => {
        const style = getComputedStyle(el);
        return style.overflowX !== 'hidden' && style.touchAction !== 'none';
      });
      expect(allowsSwipe).toBe(true);
    });

    test('should not allow swiping the segment view when swipeGesture is false', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment-view swipe-gesture="false">
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      await page.waitForChanges();

      const segmentView = page.locator('ion-segment-view');

      const allowsSwipe = await segmentView.evaluate((el: HTMLElement) => {
        const style = getComputedStyle(el);
        return style.overflowX !== 'hidden' && style.touchAction !== 'none';
      });
      expect(allowsSwipe).toBe(false);
    });
  });
});
