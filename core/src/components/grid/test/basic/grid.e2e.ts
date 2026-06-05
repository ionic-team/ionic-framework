import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: basic'), () => {
    test('should not have visual regressions for default columns', async ({ page }) => {
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
              <ion-col size="3"><div>ion-col</div></ion-col>
              <ion-col size="3"><div>ion-col</div></ion-col>
              <ion-col size="3"><div>ion-col</div></ion-col>
              <ion-col size="3"><div>ion-col</div></ion-col>
              <ion-col size="6"><div>ion-col[width-50]</div></ion-col>
              <ion-col size="3"><div>ion-col</div></ion-col>
              <ion-col size="3"><div>ion-col</div></ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="3"><div>ion-col[width-25]</div></ion-col>
              <ion-col><div>ion-col</div></ion-col>
              <ion-col size="3"><div>ion-col[width-25]</div></ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="3"><div>ion-col[width-25]</div></ion-col>
              <ion-col size="3" offset="3"><div>ion-col[width-25][offset-25]</div></ion-col>
            </ion-row>

            <ion-row>
              <ion-col><div>ion-col</div></ion-col>
              <ion-col><div>ion-col<br />#</div></ion-col>
              <ion-col><div>ion-col<br /># <br />#</div></ion-col>
              <ion-col><div>ion-col<br /># <br /># <br />#</div></ion-col>
            </ion-row>

            <ion-row>
              <ion-col class="ion-align-self-start"><div>ion-col[top]</div></ion-col>
              <ion-col class="ion-align-self-center"><div>ion-col[center]</div></ion-col>
              <ion-col class="ion-align-self-end"><div>ion-col[bottom]</div></ion-col>
              <ion-col><div>ion-col<br /># <br />#</div></ion-col>
            </ion-row>

            <ion-row class="ion-align-items-start">
              <ion-col><div>[top] ion-col</div></ion-col>
              <ion-col><div>[top] ion-col</div></ion-col>
              <ion-col class="ion-align-self-end"><div>[top] ion-col[bottom]</div></ion-col>
              <ion-col><div>ion-col<br /># <br />#</div></ion-col>
            </ion-row>

            <ion-row class="ion-align-items-center">
              <ion-col><div>[center] ion-col</div></ion-col>
              <ion-col><div>[center] ion-col</div></ion-col>
              <ion-col><div>[center] ion-col</div></ion-col>
              <ion-col><div>ion-col<br /># <br />#</div></ion-col>
            </ion-row>

            <ion-row class="ion-align-items-end">
              <ion-col><div>[bottom] ion-col</div></ion-col>
              <ion-col class="ion-align-self-start"><div>[bottom] ion-col[top]</div></ion-col>
              <ion-col><div>[bottom] ion-col</div></ion-col>
              <ion-col><div>ion-col<br /># <br />#</div></ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="12" size-sm><div>[responsive-sm] ion-col</div></ion-col>
              <ion-col size="12" size-sm><div>[responsive-sm] ion-col</div></ion-col>
              <ion-col size="12" size-sm><div>[responsive-sm] ion-col</div></ion-col>
              <ion-col size="12" size-sm><div>[responsive-sm] ion-col</div></ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="12" size-md><div>[responsive-md] ion-col</div></ion-col>
              <ion-col size="12" size-md><div>[responsive-md] ion-col</div></ion-col>
              <ion-col size="12" size-md><div>[responsive-md] ion-col</div></ion-col>
              <ion-col size="12" size-md><div>[responsive-md] ion-col</div></ion-col>
            </ion-row>

            <ion-row responsive-lg>
              <ion-col size="6" offset="3"><div>[responsive-lg] ion-col[width-50][offset-25]</div></ion-col>
              <ion-col size="3"><div>[responsive-lg] ion-col[width-25]</div></ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      const grid = page.locator('ion-grid');

      /**
       * Grid overflows the default viewport, causing
       * unrendered areas to appear black in the screenshot.
       * Resizing to fit content.
       */
      const box = await grid.boundingBox();
      await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

      await expect(grid).toHaveScreenshot(screenshot('grid-basic'));
    });

    test('should not have visual regressions for custom columns', async ({ page }) => {
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

          <ion-grid style="--ion-grid-columns: 16">
            <ion-row>
              <ion-col size="16"><div>16</div></ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="8"><div>8</div></ion-col>
              <ion-col size="8"><div>8</div></ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="13"><div>13</div></ion-col>
              <ion-col size="3"><div>3</div></ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="10" offset="6"><div>size 10, offset 6</div></ion-col>
            </ion-row>
          </ion-grid>
        `,
        config
      );

      await page.setIonViewport();

      const grid = page.locator('ion-grid');

      await expect(grid).toHaveScreenshot(screenshot('grid-custom-columns'));
    });
  });
});
