import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
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
