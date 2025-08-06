import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('reorder-group: events:'), () => {
    test.describe('ionReorderStart', () => {
      test('should emit when the reorder operation starts', async ({ page }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionReorderStart = await page.spyOnEvent('ionReorderStart');

        await expect(ionReorderStart).toHaveReceivedEventTimes(0);

        // Start the drag to verify it emits the event without having to
        // actually move the item. Do not release the drag here.
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 0, undefined, undefined, false);

        await page.waitForChanges();

        await expect(ionReorderStart).toHaveReceivedEventTimes(1);

        // Drag the reorder item further to verify it does
        // not emit the event again
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 300);

        await page.waitForChanges();

        await expect(ionReorderStart).toHaveReceivedEventTimes(1);
      });
    });

    test.describe('ionReorderMove', () => {
      test('should emit when the reorder operation does not move the item position', async ({ page }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionReorderMove = await page.spyOnEvent('ionReorderMove');

        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 0);

        await page.waitForChanges();

        expect(ionReorderMove.events.length).toBeGreaterThan(0);

        // Grab the last event to verify that it is emitting
        // the correct from and to positions
        const lastEvent = ionReorderMove.events[ionReorderMove.events.length - 1];
        expect(lastEvent?.detail.from).toBe(0);
        expect(lastEvent?.detail.to).toBe(0);
      });

      test('should emit when the reorder operation moves the item by multiple positions', async ({ page }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionReorderMove = await page.spyOnEvent('ionReorderMove');

        // Drag the reorder item by a lot to verify it emits the event
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 300);

        await page.waitForChanges();

        expect(ionReorderMove.events.length).toBeGreaterThan(0);

        // Grab the last event where the from and to are different to
        // verify that it is not using the gesture start position as the from
        const lastDifferentEvent = ionReorderMove.events
          .reverse()
          .find((event) => event.detail.from !== event.detail.to);
        expect(lastDifferentEvent?.detail.from).toBe(1);
        expect(lastDifferentEvent?.detail.to).toBe(2);
      });
    });

    test.describe('ionReorderEnd', () => {
      test('should emit without details when the reorder operation ends without moving the item position', async ({
        page,
      }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionReorderEnd = await page.spyOnEvent('ionReorderEnd');

        // Drag the reorder item a little bit but not enough to
        // make it switch to a different position
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 20);

        await page.waitForChanges();

        await expect(ionReorderEnd).toHaveReceivedEventTimes(1);
        await expect(ionReorderEnd).toHaveReceivedEventDetail({ from: 0, to: 0, complete: undefined });
      });

      test('should emit with details when the reorder operation ends and the item has moved', async ({ page }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionReorderEnd = await page.spyOnEvent('ionReorderEnd');

        // Start the drag to verify it does not emit the event at the start
        // of the drag or during the drag. Do not release the drag here.
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 100, undefined, undefined, false);

        await page.waitForChanges();

        await expect(ionReorderEnd).toHaveReceivedEventTimes(0);

        // Drag the reorder item further and release the drag to verify it emits the event
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 300);

        await page.waitForChanges();

        await expect(ionReorderEnd).toHaveReceivedEventTimes(1);
        await expect(ionReorderEnd).toHaveReceivedEventDetail({ from: 0, to: 2, complete: undefined });
      });
    });

    // TODO(FW-6590): Remove this once the deprecated event is removed
    test.describe('ionItemReorder', () => {
      test('should not emit when the reorder operation ends without moving the item position', async ({ page }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionItemReorder = await page.spyOnEvent('ionItemReorder');

        // Drag the reorder item a little bit but not enough to
        // make it switch to a different position
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 20);

        await page.waitForChanges();

        await expect(ionItemReorder).toHaveReceivedEventTimes(0);
      });

      test('should emit when the reorder operation ends and the item has moved', async ({ page }) => {
        await page.setContent(
          `
          <ion-reorder-group disabled="false">
            <ion-item>
              <ion-label>Item 1</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 2</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
            <ion-item>
              <ion-label>Item 3</ion-label>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
        `,
          config
        );

        const reorderGroup = page.locator('ion-reorder-group');
        const ionItemReorder = await page.spyOnEvent('ionItemReorder');

        // Start the drag to verify it does not emit the event at the start
        // of the drag or during the drag. Do not release the drag here.
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 100, undefined, undefined, false);

        await page.waitForChanges();

        await expect(ionItemReorder).toHaveReceivedEventTimes(0);

        // Drag the reorder item further and release the drag to verify it emits the event
        await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 300);

        await page.waitForChanges();

        await expect(ionItemReorder).toHaveReceivedEventTimes(1);
        await expect(ionItemReorder).toHaveReceivedEventDetail({ from: 0, to: 2, complete: undefined });
      });
    });
  });
});
