import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: sizes'), () => {
    test('should not have visual regressions for responsive sm columns', async ({ page }) => {
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

          <ion-grid>
            <ion-row>
              <ion-col size="12" size-sm><div>col</div></ion-col>
              <ion-col size="12" size-sm><div>col</div></ion-col>
              <ion-col size="12" size-sm><div>col</div></ion-col>
              <ion-col size="12" size-sm><div>col</div></ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      await page.setIonViewport();

      const grid = page.locator('ion-grid');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-responsive-sm'));
    });

    test('should not have visual regressions for auto sized columns', async ({ page }) => {
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

          <ion-grid>
            <ion-row>
              <ion-col><div>col</div></ion-col>
              <ion-col size="auto"><div>col with extra text to make it auto</div></ion-col>
              <ion-col><div>col</div></ion-col>
              <ion-col><div>col</div></ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      await page.setIonViewport();

      const grid = page.locator('ion-grid');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-size-auto'));
    });

    test('should not have visual regressions for breakpoint sizes', async ({ page }) => {
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

          <div id="breakpoint-sizes">
            <ion-grid>
              <ion-row>
                <ion-col size="12" size-sm="6" size-md="4" size-lg="3" size-xl="1"><div>size 12, sm 6, md 4, lg 3, xl 1</div></ion-col>
                <ion-col size="12" size-sm="6" size-md="4" size-lg="3" size-xl="1"><div>size 12, sm 6, md 4, lg 3, xl 1</div></ion-col>
                <ion-col size="12" size-sm="6" size-md="4" size-lg="3" size-xl="1"><div>size 12, sm 6, md 4, lg 3, xl 1</div></ion-col>
                <ion-col size="12" size-sm="6" size-md="4" size-lg="3" size-xl="1"><div>size 12, sm 6, md 4, lg 3, xl 1</div></ion-col>
              </ion-row>
            </ion-grid>

            <ion-grid>
              <ion-row>
                <ion-col size="2"><div>size 2</div></ion-col>
                <ion-col size="1"><div>size 1</div></ion-col>
                <ion-col size="2"><div>size 2</div></ion-col>
                <ion-col size="3"><div>size 3</div></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      await page.setIonViewport();

      const breakpointSizes = page.locator('#breakpoint-sizes');

      await expect(breakpointSizes).toHaveScreenshot(screenshot('grid-sizes-breakpoint-sizes'));
    });

    test('should size each column to its fraction of a 10 column grid', async ({ page }) => {
      await page.setContent(
        `
          <ion-grid style="--ion-grid-columns: 10">
            <ion-row>
              <ion-col size="1">1</ion-col>
              <ion-col size="3">3</ion-col>
              <ion-col size="3">3</ion-col>
              <ion-col size="2">2</ion-col>
              <ion-col size="1">1</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const { rowWidth, columns } = await page.locator('ion-row').evaluate((row) => {
        const cols = Array.from(row.querySelectorAll('ion-col'));

        return {
          rowWidth: row.clientWidth,
          columns: cols.map((col) => ({
            size: Number(col.getAttribute('size')),
            width: col.getBoundingClientRect().width,
          })),
        };
      });

      // The grid overrides columns to 10, so one column unit is rowWidth / 10
      const columnUnit = rowWidth / 10;

      for (const column of columns) {
        expect(column.width).toBeCloseTo(columnUnit * column.size, 0);
      }
    });
  });
});
