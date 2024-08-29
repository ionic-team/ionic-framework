import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-radio only takes up as much space
 * as it needs. Justification is used for when the
 * radio should take up the full line (such as in an
 * ion-item or when it has 100% width).
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: label'), () => {
    test.describe('radio: default placement', () => {
      test('should render a space between justification with a full width radio', async ({ page }) => {
        await page.setContent(
          `
          <ion-radio-group value="1">
            <ion-radio value="1" style="width: 100%">
              Label
            </ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-full-width`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        // radio needs to be full width to truncate properly
        // because it is not inside of an `ion-app` in tests
        await page.setContent(
          `
          <ion-radio-group value="1">
            <ion-radio value="1" style="width: 100%">
              Long Label Long Label Long Label Long Label Long Label Long Label
            </ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-long-label`));
      });
    });

    test.describe('radio: start placement', () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="start" justify="start" value="1">Label</ion-radio>
           </ion-radio-group>
           `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-start-justify-start`));
      });
      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="start" justify="end" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-start-justify-end`));
      });
      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="start" justify="space-between" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-start-justify-space-between`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        await page.setContent(
          `
          <ion-radio-group value="1">
            <ion-radio value="1" label-placement="start" justify="start">
              Long Label Long Label Long Label Long Label Long Label Long Label
            </ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-start-justify-start-long-label`));
      });
    });

    test.describe('radio: end placement', () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="end" justify="start" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-end-justify-start`));
      });
      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="end" justify="end" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-end-justify-end`));
      });
      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="end" justify="space-between" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-end-justify-space-between`));
      });
    });

    test.describe('radio: fixed placement', () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="fixed" justify="start" value="1">This is a long label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-fixed-justify-start`));
      });
      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="fixed" justify="end" value="1">This is a long label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-fixed-justify-end`));
      });
      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="fixed" justify="space-between" value="1">This is a long label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-fixed-justify-space-between`));
      });
    });
    test.describe('radio: stacked placement', () => {
      test('should align the label to the start of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-radio-group value="1">
              <ion-radio label-placement="stacked" alignment="start" value="1">This is a long label</ion-radio>
            </ion-radio-group>
          `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-stacked-align-start`));
      });

      test('should align the label to the center of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-radio-group value="1">
              <ion-radio label-placement="stacked" alignment="center" value="1">This is a long label</ion-radio>
            </ion-radio-group>
          `,
          config
        );

        const radio = page.locator('ion-radio');
        await expect(radio).toHaveScreenshot(screenshot(`radio-label-stacked-align-center`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('radio: stacked long label'), () => {
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
          <ion-radio label-placement="stacked" alignment="start">Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications Enable Notifications</ion-radio>
        `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-label-stacked-long-label`));
    });
  });
});
