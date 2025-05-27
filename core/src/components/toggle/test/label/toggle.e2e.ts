import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-toggle only takes up as much space
 * as it needs. Justification is used for when the
 * toggle should take up the full line (such as in an
 * ion-item or when it has 100% width).
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: label'), () => {
    test.describe('toggle: default placement', () => {
      test('should render a space between justification with a full width toggle', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle style="width: 100%">
            Label
          </ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-full-width`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        // toggle needs to be full width to truncate properly
        // because it is not inside of an `ion-app` in tests
        await page.setContent(
          `
          <ion-toggle style="width: 100%">
            Long Label Long Label Long Label Long Label Long Label Long Label
          </ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-long-label`));
      });
    });

    test.describe(title('toggle: start placement'), () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="start" justify="start">Label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-start`));
      });
      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="start" justify="end">Label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-end`));
      });
      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="start" justify="space-between">Label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-space-between`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="start" justify="start">
            Long Label Long Label Long Label Long Label Long Label Long Label
          </ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-start-long-label`));
      });
    });

    test.describe(title('toggle: end placement'), () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="end" justify="start">Label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-end-justify-start`));
      });
      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="end" justify="end">Label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-end-justify-end`));
      });
      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="end" justify="space-between">Label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-end-justify-space-between`));
      });
    });

    test.describe(title('toggle: fixed placement'), () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="fixed" justify="start">This is a long label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-fixed-justify-start`));
      });
      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="fixed" justify="end">This is a long label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-fixed-justify-end`));
      });
      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
          <ion-toggle label-placement="fixed" justify="space-between">This is a long label</ion-toggle>
        `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-fixed-justify-space-between`));
      });
    });

    test.describe(title('toggle: stacked placement'), () => {
      test('should align the label to the start of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-toggle label-placement="stacked" alignment="start">This is a long label</ion-toggle>
          `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-stacked-align-start`));
      });

      test('should align the label to the center of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-toggle label-placement="stacked" alignment="center">This is a long label</ion-toggle>
          `,
          config
        );

        const toggle = page.locator('ion-toggle');
        await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-stacked-align-center`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('toggle: stacked long label'), () => {
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
          <ion-toggle label-placement="stacked" alignment="start">Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications</ion-toggle>
        `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-stacked-long-label`));
    });
  });
});
