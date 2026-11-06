import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * Title placement is only supported by the `ionic` theme.
 */
configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toolbar: title-placement'), () => {
    ['start', 'center', 'end'].forEach((placement) => {
      test(`should not have visual regressions with ${placement} placement`, async ({ page }) => {
        const placementTitle = placement.charAt(0).toUpperCase() + placement.slice(1);

        await page.setContent(
          `
              <ion-header>
                <ion-toolbar title-placement="${placement}">
                  <ion-title>${placementTitle} Placement</ion-title>
                </ion-toolbar>
                <ion-toolbar title-placement="${placement}">
                  <ion-buttons slot="start">
                    <ion-button>
                      <ion-icon slot="icon-only" name="menu"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                  <ion-title>${placementTitle} Placement</ion-title>
                </ion-toolbar>
                <ion-toolbar title-placement="${placement}">
                  <ion-title>${placementTitle} Placement</ion-title>
                  <ion-buttons slot="primary">
                    <ion-button>
                      <ion-icon slot="icon-only" name="search"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
            `,
          config
        );

        const header = page.locator('ion-header');
        await expect(header).toHaveScreenshot(screenshot(`toolbar-title-placement-${placement}`));
      });
    });
  });
});

/**
 * Title placement is only supported by the `ionic` theme.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toolbar: title-placement center sizing'), () => {
    /**
     * Returns how far the title is from the center of the toolbar, in pixels.
     */
    const getTitleOffset = async (page: E2EPage) => {
      const toolbarBox = (await page.locator('ion-toolbar').boundingBox())!;
      const titleBox = (await page.locator('ion-title .toolbar-title').boundingBox())!;

      const toolbarCenter = toolbarBox.x + toolbarBox.width / 2;
      const titleCenter = titleBox.x + titleBox.width / 2;

      return Math.abs(titleCenter - toolbarCenter);
    };

    test('should keep the title centered when buttons are added to a slot', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar title-placement="center">
              <ion-buttons slot="start">
                <ion-button>Back</ion-button>
              </ion-buttons>
              <ion-title>Center Placement</ion-title>
              <ion-buttons slot="end">
                <ion-button>Edit</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      await page.locator('ion-buttons[slot="end"]').evaluate((el) => {
        el.insertAdjacentHTML('beforeend', '<ion-button>Share</ion-button>');
      });

      await expect.poll(() => getTitleOffset(page)).toBeLessThanOrEqual(1);
    });

    test('should give the title the space freed when buttons are removed from a slot', async ({ page }) => {
      /**
       * Each toolbar is in its own header so both get the same styles.
       * The reference toolbar renders the final content from the start.
       */
      const getHeader = (id: string, endButtons: string) => `
        <ion-header id="${id}">
          <ion-toolbar title-placement="center">
            <ion-buttons slot="start">
              <ion-button>Back</ion-button>
            </ion-buttons>
            <ion-title>Center Placement</ion-title>
            <ion-buttons slot="end">${endButtons}</ion-buttons>
          </ion-toolbar>
        </ion-header>
      `;
      await page.setContent(
        getHeader('changed', '<ion-button>Edit</ion-button><ion-button id="share">Share</ion-button>') +
          getHeader('reference', '<ion-button>Edit</ion-button>'),
        config
      );

      const getTitleWidth = async (headerId: string) =>
        (await page.locator(`#${headerId} ion-title .toolbar-title`).boundingBox())!.width;

      await page.locator('#share').evaluate((el) => el.remove());

      // Once the Share button is gone, both toolbars have the same content.
      await expect
        .poll(async () => {
          const changedWidth = await getTitleWidth('changed');
          const referenceWidth = await getTitleWidth('reference');
          return changedWidth - referenceWidth;
        })
        .toBe(0);
    });

    test('should center the title when a hidden toolbar becomes visible', async ({ page }) => {
      await page.setContent(
        `
          <ion-header style="display: none">
            <ion-toolbar title-placement="center">
              <ion-buttons slot="start">
                <ion-button>Back</ion-button>
              </ion-buttons>
              <ion-title>Center Placement</ion-title>
              <ion-buttons slot="end">
                <ion-button>Edit</ion-button>
                <ion-button>Share</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      /**
       * Pages stay hidden while they are being navigated to. Keep the toolbar
       * hidden long enough that it can only be centered by measuring the
       * slots again once it is shown.
       */
      await page.waitForTimeout(1000);
      await page.locator('ion-header').evaluate((el: HTMLElement) => (el.style.display = ''));

      await expect.poll(() => getTitleOffset(page)).toBeLessThanOrEqual(1);
    });
  });
});
