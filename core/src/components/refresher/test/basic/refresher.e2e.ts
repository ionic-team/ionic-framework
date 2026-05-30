import { expect } from '@playwright/test';
import { configs, dragElementByYAxis, test } from '@utils/test/playwright';

import { pullToRefresh } from '../test.utils';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('refresher: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/refresher/test/basic', config);
    });

    test.describe('legacy refresher', () => {
      test('should load more items when performing a pull-to-refresh', async ({ page }) => {
        const items = page.locator('ion-item');

        expect(await items.count()).toBe(30);

        await pullToRefresh(page);

        expect(await items.count()).toBe(60);
      });

      test('should emit ionPullStart and ionPullEnd with reason complete', async ({ page }) => {
        const ionPullStartEvent = await page.spyOnEvent('ionPullStartFired');
        const ionPullEndEvent = await page.spyOnEvent('ionPullEndFired');

        await pullToRefresh(page);

        // Wait for the close animation to complete
        await page.waitForTimeout(700);

        expect(ionPullStartEvent).toHaveReceivedEventTimes(1);
        expect(ionPullEndEvent).toHaveReceivedEventTimes(1);
        expect(ionPullEndEvent).toHaveReceivedEventDetail({ reason: 'complete' });
      });

      test('should emit ionPullEnd with reason cancel when pull is released early', async ({ page }) => {
        const target = page.locator('body');

        const ionPullStartEvent = await page.spyOnEvent('ionPullStartFired');
        const ionPullEndEvent = await page.spyOnEvent('ionPullEndFired');

        // Pull down only 40px (less than pullMin of 60px) to trigger cancel
        await dragElementByYAxis(target, page, 40);

        // Wait for the cancel animation to complete
        await page.waitForTimeout(700);

        expect(ionPullStartEvent).toHaveReceivedEventTimes(1);
        expect(ionPullEndEvent).toHaveReceivedEventTimes(1);
        expect(ionPullEndEvent).toHaveReceivedEventDetail({ reason: 'cancel' });
      });
    });

    test.describe('native refresher', () => {
      test('should load more items when performing a pull-to-refresh', async ({ page }) => {
        const refresherContent = page.locator('ion-refresher-content');
        refresherContent.evaluateHandle((el: any) => {
          // Resets the pullingIcon to enable the native refresher
          el.pullingIcon = undefined;
        });

        await page.waitForChanges();

        const items = page.locator('ion-item');
        expect(await items.count()).toBe(30);

        await pullToRefresh(page);

        expect(await items.count()).toBe(60);
      });

      test('should emit ionPullStart and ionPullEnd with reason complete', async ({ page }) => {
        const refresherContent = page.locator('ion-refresher-content');
        refresherContent.evaluateHandle((el: any) => {
          // Resets the pullingIcon to enable the native refresher
          el.pullingIcon = undefined;
        });

        await page.waitForChanges();

        const ionPullStartEvent = await page.spyOnEvent('ionPullStartFired');
        const ionPullEndEvent = await page.spyOnEvent('ionPullEndFired');

        await pullToRefresh(page);

        // Wait for the reset animation to complete (native refresher takes longer due to CSS transitions)
        await page.waitForTimeout(1500);

        expect(ionPullStartEvent).toHaveReceivedEventTimes(1);
        expect(ionPullEndEvent).toHaveReceivedEventTimes(1);
        expect(ionPullEndEvent).toHaveReceivedEventDetail({ reason: 'complete' });
      });
    });
  });
});
