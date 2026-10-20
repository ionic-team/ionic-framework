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
 * Returns how far the title text is from the center of the toolbar.
 */
const getTitleOffset = (page: E2EPage) => {
  return page.locator('ion-toolbar').evaluate((toolbar) => {
    const range = document.createRange();
    range.selectNodeContents(toolbar.querySelector('ion-title')!);
    const text = range.getBoundingClientRect();
    const box = toolbar.getBoundingClientRect();

    return Math.abs(text.left + text.width / 2 - (box.left + box.width / 2));
  });
};

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toolbar: title-placement'), () => {
    test('should center the title when buttons are added after the toolbar loads', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar title-placement="center">
              <ion-title>Title</ion-title>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      const toolbar = page.locator('ion-toolbar');
      await toolbar.evaluate((toolbar) => {
        toolbar.insertAdjacentHTML(
          'afterbegin',
          '<ion-buttons slot="start"><ion-button>Long button text</ion-button></ion-buttons>'
        );
      });

      await expect(toolbar).toHaveClass(/show-end/);
      await expect.poll(() => getTitleOffset(page)).toBeLessThanOrEqual(1);
    });

    test('should center the title when buttons resize after the toolbar moves', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar title-placement="center">
              <ion-buttons slot="start">
                <ion-button>Back</ion-button>
              </ion-buttons>
              <ion-title>Title</ion-title>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      // Lets the load-time measurement finish, so only the observer can measure again
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)));

      // Moves the toolbar to a new header
      await page.evaluate(() => {
        const header = document.createElement('ion-header');
        document.body.appendChild(header);
        header.appendChild(document.querySelector('ion-toolbar')!);
      });

      await page.locator('ion-toolbar ion-button').evaluate((button) => {
        button.textContent = 'Long button text';
      });

      await expect.poll(() => getTitleOffset(page)).toBeLessThanOrEqual(1);
    });
  });
});
