import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 * The ionic theme has no dark palette color for the line.
 */
[
  ...configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }),
  ...configs({ directions: ['ltr'], modes: ['ios', 'md'], palettes: ['dark'] }),
].forEach(({ config, screenshot, title }) => {
  test.describe(title('divider: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            top
            <ion-divider></ion-divider>
            bottom
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`divider-basic-default`));
    });
  });
});

/**
 * This behavior does not vary across modes or directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('divider: inheritance'), () => {
    const getSpacing = (page: Page, id: string) =>
      page.locator(`#${id}`).evaluate((divider) => {
        const host = getComputedStyle(divider);
        const line = getComputedStyle(divider.shadowRoot!.querySelector('hr')!);

        return {
          marginTop: line.marginTop,
          marginBottom: line.marginBottom,
          paddingStart: host.paddingInlineStart,
          paddingEnd: host.paddingInlineEnd,
        };
      });

    test('should not inherit spacing variables from an ancestor', async ({ page }) => {
      await page.setContent(
        `
          <ion-divider id="reference"></ion-divider>
          <div style="--margin-top: 50px; --margin-bottom: 50px; --padding-start: 20px; --padding-end: 20px">
            <ion-divider id="nested"></ion-divider>
          </div>
        `,
        config
      );

      expect(await getSpacing(page, 'nested')).toEqual(await getSpacing(page, 'reference'));
    });

    test('should use spacing variables an ancestor sets on the divider', async ({ page }) => {
      await page.setContent(
        `
          <style>
            .parent ion-divider {
              --margin-top: 50px;
              --margin-bottom: 50px;
              --padding-start: 20px;
              --padding-end: 20px;
            }
          </style>
          <div class="parent">
            <ion-divider id="nested"></ion-divider>
          </div>
        `,
        config
      );

      expect(await getSpacing(page, 'nested')).toEqual({
        marginTop: '50px',
        marginBottom: '50px',
        paddingStart: '20px',
        paddingEnd: '20px',
      });
    });
  });
});

/**
 * Other ios tests draw at 1x (refer to the `deviceScaleFactor` fixture in
 * `playwright-page.ts`), so they never show a line at its real thickness.
 * This test draws at each browser's own density and keeps every pixel,
 * so a missing, thicker or misplaced line fails. Only the ios theme draws lines
 * thinner than one CSS pixel.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('divider: device resolution'), () => {
    // Resets the 1x that ios tests get to the browser's own density
    test.use({ deviceScaleFactor: undefined });

    test('should not have visual regressions', async ({ page }) => {
      // The dividers start 0, 1/3 and 2/3 of a pixel down from a whole pixel
      await page.setContent(
        `
          <style>
            #container {
              width: 120px;
            }
          </style>
          <div id="container">
            <div style="height: 20px"></div>
            <ion-divider></ion-divider>
            <div style="height: 20.33px"></div>
            <ion-divider></ion-divider>
            <div style="height: 20.34px"></div>
            <ion-divider></ion-divider>
            <div style="height: 20px"></div>
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`divider-device`), { scale: 'device' });
    });
  });
});
