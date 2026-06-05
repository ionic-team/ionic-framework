import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: padding'), () => {
    test('should remove all padding with the no padding utility', async ({ page }) => {
      await page.setContent(
        `
          <ion-grid class="ion-no-padding">
            <ion-row>
              <ion-col>col</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const padding = await page.locator('ion-grid').evaluate((grid) => {
        const styles = getComputedStyle(grid);

        return {
          top: styles.paddingTop,
          end: styles.paddingInlineEnd,
          bottom: styles.paddingBottom,
          start: styles.paddingInlineStart,
        };
      });

      expect(padding).toEqual({ top: '0px', end: '0px', bottom: '0px', start: '0px' });
    });

    test('should not have visual regressions for a nested grid', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-grid {
              background: #b9ce4f;
            }

            ion-col {
              background: #e2b863;
            }

            ion-col div {
              background-color: #f7f7f7;
              border: 1px solid #ddd;
              font-size: 0.8em;
              padding: 10px 5px;
            }
          </style>

          <div id="nested">
            <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col>
                  <ion-grid>
                    <ion-row>
                      <ion-col><div>col</div></ion-col>
                      <ion-col><div>col</div></ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-col>
                <ion-col><div>col</div></ion-col>
                <ion-col><div>col</div></ion-col>
                <ion-col><div>col</div></ion-col>
              </ion-row>
            </ion-grid>
          </div>
        `,
        config
      );

      await page.setIonViewport();

      const nested = page.locator('#nested');

      await expect(nested).toHaveScreenshot(screenshot('grid-padding-nested'));
    });

    test('should not have visual regressions for default padding', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-grid {
              background: #b9ce4f;
            }

            ion-col {
              background: #e2b863;
            }

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
              <ion-col><div>col</div></ion-col>
              <ion-col><div>col</div></ion-col>
              <ion-col><div>col</div></ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      await page.setIonViewport();

      const grid = page.locator('ion-grid');

      await expect(grid).toHaveScreenshot(screenshot('grid-padding-default'));
    });

    test('should apply custom grid padding from the breakpoint variables', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-grid {
              --ion-grid-breakpoint-xs-padding-top: 8px;
              --ion-grid-breakpoint-xs-padding-end: 8px;
              --ion-grid-breakpoint-xs-padding-bottom: 8px;
              --ion-grid-breakpoint-xs-padding-start: 8px;
            }
          </style>

          <ion-grid>
            <ion-row>
              <ion-col>col</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const padding = await page.locator('ion-grid').evaluate((grid) => {
        const styles = getComputedStyle(grid);

        return {
          top: styles.paddingTop,
          end: styles.paddingInlineEnd,
          bottom: styles.paddingBottom,
          start: styles.paddingInlineStart,
        };
      });

      expect(padding).toEqual({ top: '8px', end: '8px', bottom: '8px', start: '8px' });
    });

    test('should apply custom column padding from the breakpoint variables', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-col {
              --ion-col-breakpoint-xs-padding-top: 2px;
              --ion-col-breakpoint-xs-padding-end: 2px;
              --ion-col-breakpoint-xs-padding-bottom: 2px;
              --ion-col-breakpoint-xs-padding-start: 2px;
            }
          </style>

          <ion-grid>
            <ion-row>
              <ion-col>col</ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const padding = await page.locator('ion-col').evaluate((col) => {
        const styles = getComputedStyle(col);

        return {
          top: styles.paddingTop,
          end: styles.paddingInlineEnd,
          bottom: styles.paddingBottom,
          start: styles.paddingInlineStart,
        };
      });

      expect(padding).toEqual({ top: '2px', end: '2px', bottom: '2px', start: '2px' });
    });
  });
});
