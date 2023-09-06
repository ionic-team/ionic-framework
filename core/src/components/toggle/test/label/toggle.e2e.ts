import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-toggle only takes up
 * as much space as it needs. Justification is
 * used for when the toggle takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the toggle so we can
 * see the justification results.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: start placement'), () => {
    test('should render a start justification with label in the start position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="start" justify="start" style="width: 200px">Label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-start`));
    });
    test('should render an end justification with label in the start position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="start" justify="end" style="width: 200px">Label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-end`));
    });
    test('should render a space between justification with label in the start position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="start" justify="space-between" style="width: 200px">Label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-start-justify-space-between`));
    });
  });

  test.describe(title('toggle: end placement'), () => {
    test('should render a start justification with label in the end position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="end" justify="start" style="width: 200px">Label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-end-justify-start`));
    });
    test('should render an end justification with label in the end position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="end" justify="end" style="width: 200px">Label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-end-justify-end`));
    });
    test('should render a space between justification with label in the end position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="end" justify="space-between" style="width: 200px">Label</ion-toggle>
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

         <ion-toggle label-placement="fixed" justify="start" style="width: 200px">This is a long label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-fixed-justify-start`));
    });
    test('should render an end justification with label in the fixed position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="fixed" justify="end" style="width: 200px">This is a long label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-fixed-justify-end`));
    });
    test('should render a space between justification with label in the fixed position', async ({ page }) => {
      await page.setContent(
        `

         <ion-toggle label-placement="fixed" justify="space-between" style="width: 200px">This is a long label</ion-toggle>
       `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-label-fixed-justify-space-between`));
    });
  });
});
