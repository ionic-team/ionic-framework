import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-checkbox only takes up
 * as much space as it needs. Justification is
 * used for when the checkbox takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the checkbox so we can
 * see the justification results.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: label'), () => {
    test.describe('checkbox: start placement', () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="start" style="width: 200px">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-start-justify-start`));
      });

      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="end" style="width: 200px">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-start-justify-end`));
      });

      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="space-between" style="width: 200px">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-start-justify-space-between`));
      });

      test('should truncate long labels with ellipses', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="start" justify="start" style="width: 200px">
             Long Label Long Label Long Label Long Label Long Label Long Label
           </ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-long-label`));
      });
    });

    test.describe('checkbox: end placement', () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="end" justify="start" style="width: 200px">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-end-justify-start`));
      });

      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="end" justify="end" style="width: 200px">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-end-justify-end`));
      });

      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="end" justify="space-between" style="width: 200px">Label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-end-justify-space-between`));
      });
    });

    test.describe('checkbox: fixed placement', () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="fixed" justify="start" style="width: 200px">This is a long label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-fixed-justify-start`));
      });

      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="fixed" justify="end" style="width: 200px">This is a long label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-fixed-justify-end`));
      });

      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-checkbox label-placement="fixed" justify="space-between" style="width: 200px">This is a long label</ion-checkbox>
         `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-fixed-justify-space-between`));
      });
    });

    test.describe('checkbox: stacked placement', () => {
      test('should align the label to the start of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-checkbox label-placement="stacked" align="start" style="width: 200px">This is a long label</ion-checkbox>
          `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-stacked-align-start`));
      });

      test('should align the label to the center of the container in the stacked position', async ({ page }) => {
        await page.setContent(
          `
            <ion-checkbox label-placement="stacked" align="center" style="width: 200px">This is a long label</ion-checkbox>
          `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-label-stacked-align-center`));
      });
    });
  });
});
