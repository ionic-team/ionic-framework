import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-checkbox only takes up as much space
 * as it needs. Justification is used for when the
 * checkbox should take up the full line (such as in an
 * ion-item or when it has 100% width).
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: label'), () => {
    test.describe('checkbox: default placement', () => {
      test('should render a space between justification with a full width checkbox', async ({ page }) => {
        await page.setContent(
          `
          <ion-checkbox style="width: 100%">
             Label
           </ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-full-width`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        // Checkbox needs to be full width to truncate properly
        // because it is not inside of an `ion-app` in tests
        await page.setContent(
          `
          <ion-checkbox style="width: 100%">
             Long Label Long Label Long Label Long Label Long Label Long Label
           </ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-long-label`));
      });
    });

    test.describe('checkbox: start placement', () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="start">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-start-justify-start`));
      });

      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="end">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-start-justify-end`));
      });

      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="space-between">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-start-justify-space-between`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="start">
             Long Label Long Label Long Label Long Label Long Label Long Label
           </ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-start-justify-start-long-label`));
      });
    });

    test.describe('checkbox: end placement', () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="end" justify="start">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-end-justify-start`));
      });

      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="end" justify="end">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-end-justify-end`));
      });

      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="end" justify="space-between">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-end-justify-space-between`));
      });
    });

    test.describe('checkbox: fixed placement', () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="fixed" justify="start">This is a long label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-fixed-justify-start`));
      });

      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="fixed" justify="end">This is a long label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-fixed-justify-end`));
      });

      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="fixed" justify="space-between">This is a long label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-fixed-justify-space-between`));
      });
    });

    test.describe('checkbox: stacked placement', () => {
      test('should align the label to the start of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-checkbox label-placement="stacked" alignment="start">This is a long label</ion-checkbox>
          `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-stacked-align-start`));
      });

      test('should align the label to the center of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-checkbox label-placement="stacked" alignment="center">This is a long label</ion-checkbox>
          `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-stacked-align-center`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('checkbox: stacked long label'), () => {
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
          <ion-checkbox label-placement="stacked" alignment="start">Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications</ion-checkbox>
        `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-label-stacked-long-label`));
    });
  });
});
