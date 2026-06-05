import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: offsets'), () => {
    test('should not have visual regressions for order', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-col div {
              background-color: #f7f7f7;
              border: 1px solid #ddd;
              font-size: 0.8em;
              padding: 10px 5px;
            }
          </style>

          <div id="order">
            <ion-grid>
              <ion-row>
                <ion-col size="9" order="2"><div>order 2</div></ion-col>
                <ion-col size="3" order="1"><div>order 1</div></ion-col>
              </ion-row>
            </ion-grid>

            <ion-grid>
              <ion-row>
                <ion-col size="3" size-md="6" order="2" order-md="1"><div>order 2, order-md 1</div></ion-col>
                <ion-col size="9" size-md="6" order="1" order-md="2"><div>order 1, order-md 2</div></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      await page.setIonViewport();

      const order = page.locator('#order');

      await expect(order).toHaveScreenshot(screenshot('grid-offsets-order'));
    });

    test('should shift the column by its offset count in column units', async ({ page }) => {
      await page.setContent(
        `
          <ion-grid>
            <ion-row>
              <ion-col size="auto" offset="1">offset 1</ion-col>
              <ion-col size="auto" offset="0">offset 0</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const { rowWidth, offsetMargin, noOffsetMargin } = await page.locator('ion-row').evaluate((row) => {
        const offsetCol = row.querySelector('ion-col[offset="1"]')!;
        const noOffsetCol = row.querySelector('ion-col[offset="0"]')!;

        return {
          rowWidth: row.clientWidth,
          offsetMargin: parseFloat(getComputedStyle(offsetCol).marginInlineStart),
          noOffsetMargin: parseFloat(getComputedStyle(noOffsetCol).marginInlineStart),
        };
      });

      // One column unit is rowWidth / 12 (12 column grid, no gap).
      const columnUnit = rowWidth / 12;

      expect(offsetMargin).toBeCloseTo(columnUnit, 0);
      expect(noOffsetMargin).toBe(0);
    });

    test('should scale the offset margin with the offset count', async ({ page }) => {
      await page.setContent(
        `
          <ion-grid>
            <ion-row>
              <ion-col offset="5">offset 5</ion-col>
              <ion-col offset="2">offset 2</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const { rowWidth, largeOffsetMargin, smallOffsetMargin } = await page.locator('ion-row').evaluate((row) => {
        const largeOffsetCol = row.querySelector('ion-col[offset="5"]')!;
        const smallOffsetCol = row.querySelector('ion-col[offset="2"]')!;

        return {
          rowWidth: row.clientWidth,
          largeOffsetMargin: parseFloat(getComputedStyle(largeOffsetCol).marginInlineStart),
          smallOffsetMargin: parseFloat(getComputedStyle(smallOffsetCol).marginInlineStart),
        };
      });

      // One column unit is rowWidth / 12 (12 column grid, no gap).
      const columnUnit = rowWidth / 12;

      expect(largeOffsetMargin).toBeCloseTo(columnUnit * 5, 0);
      expect(smallOffsetMargin).toBeCloseTo(columnUnit * 2, 0);
    });

    test('updating the offset prop updates the column margin', async ({ page }) => {
      await page.setContent(
        `
          <ion-grid>
            <ion-row>
              <ion-col id="dynamic-offset" offset="2">offset</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const { rowWidth, offsetMargin } = await page.locator('ion-row').evaluate((row) => {
        const dynamicOffsetCol = row.querySelector('#dynamic-offset')!;

        return {
          rowWidth: row.clientWidth,
          offsetMargin: parseFloat(getComputedStyle(dynamicOffsetCol).marginInlineStart),
        };
      });

      // One column unit is rowWidth / 12 (12 column grid, no gap).
      const columnUnit = rowWidth / 12;

      expect(offsetMargin).toBeCloseTo(columnUnit * 2, 0);

      // Updating the offset from 2 to 4 shifts the column by two more units.
      const dynamicOffsetCol = page.locator('#dynamic-offset');
      await dynamicOffsetCol.evaluate((col) => col.setAttribute('offset', '4'));

      const updatedMargin = () =>
        dynamicOffsetCol.evaluate((col) => parseFloat(getComputedStyle(col).marginInlineStart));

      await expect.poll(updatedMargin).toBeCloseTo(columnUnit * 4, 0);
    });
  });
});
