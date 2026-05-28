import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('col: basic'), () => {
    test('size="6" in a default 12-col grid fills half the grid content width', async ({ page }) => {
      await page.setContent(
        `
          <div style="width: 600px;">
            <ion-grid>
              <ion-row>
                <ion-col size="6"></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      const { contentWidth, colWidth } = await page.locator('ion-grid').evaluate((grid) => {
        const styles = getComputedStyle(grid);
        const col = grid.querySelector('ion-col')!;
        return {
          contentWidth: grid.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight),
          colWidth: col.getBoundingClientRect().width,
        };
      });

      // 6 of 12 columns → col fills 50% of the grid's content area.
      // 1px tolerance for sub-pixel rounding.
      expect(colWidth).toBeGreaterThanOrEqual(contentWidth * 0.5 - 1);
      expect(colWidth).toBeLessThanOrEqual(contentWidth * 0.5 + 1);
    });

    test('overriding --ion-grid-columns cascades into col widths', async ({ page }) => {
      await page.setContent(
        `
          <div style="width: 600px;">
            <ion-grid style="--ion-grid-columns: 6;">
              <ion-row>
                <ion-col size="6"></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      const { contentWidth, colWidth } = await page.locator('ion-grid').evaluate((grid) => {
        const styles = getComputedStyle(grid);
        const col = grid.querySelector('ion-col')!;
        return {
          contentWidth: grid.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight),
          colWidth: col.getBoundingClientRect().width,
        };
      });

      // With --ion-grid-columns: 6 and size=6, col fills 6/6 = 100% of
      // the grid's content area. 1px tolerance for sub-pixel rounding.
      expect(colWidth).toBeGreaterThanOrEqual(contentWidth - 1);
      expect(colWidth).toBeLessThanOrEqual(contentWidth + 1);
    });

    test('--ion-row-gap subtracts from col widths in the cascade', async ({ page }) => {
      await page.setContent(
        `
          <div style="width: 600px;">
            <ion-grid>
              <ion-row style="--ion-row-gap: 20px;">
                <ion-col size="6"></ion-col>
                <ion-col size="6"></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      const { rowWidth, colWidth } = await page.locator('ion-row').evaluate((row) => {
        const col = row.querySelector('ion-col')!;
        return {
          rowWidth: row.clientWidth,
          colWidth: col.getBoundingClientRect().width,
        };
      });

      // Two size=6 cols share one 20px gap, so each col fills (rowWidth - 20) / 2.
      // 1px tolerance for sub-pixel rounding.
      const expected = (rowWidth - 20) / 2;
      expect(colWidth).toBeGreaterThanOrEqual(expected - 1);
      expect(colWidth).toBeLessThanOrEqual(expected + 1);
    });

    test('offset margin equals offset_count x col-unit-size', async ({ page }) => {
      await page.setContent(
        `
          <div style="width: 600px;">
            <ion-grid>
              <ion-row>
                <ion-col size="6" offset="3"></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      const { width, marginInlineStart } = await page.locator('ion-col').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const styles = getComputedStyle(el);
        return {
          width: rect.width,
          marginInlineStart: parseFloat(styles.marginInlineStart),
        };
      });

      // With size=6 and offset=3 in a 12-col grid (gap=0):
      //   col_width = 6 * unit_size = 50% of content area
      //   margin    = 3 * unit_size = 25% of content area
      //   ratio     = margin / width = (3/12) / (6/12) = 0.5
      expect(marginInlineStart / width).toBeCloseTo(0.5, 1);
    });
  });
});
