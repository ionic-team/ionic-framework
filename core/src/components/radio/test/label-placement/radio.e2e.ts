import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-radio only takes up
 * as much space as it needs. Justification is
 * used for when the radio takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the radio so we can
 * see the justification results.
 */

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: label'), () => {
    test.describe('radio: start placement', () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="start" justify="start" style="width: 200px" value="1">Label</ion-radio>
           </ion-radio-group>
           `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-start-justify-start`));
      });
      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="start" justify="end" style="width: 200px" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-start-justify-end`));
      });
      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="start" justify="space-between" style="width: 200px" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-start-justify-space-between`));
      });
    });

    test.describe('radio: end placement', () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="end" justify="start" style="width: 200px" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-end-justify-start`));
      });
      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="end" justify="end" style="width: 200px" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-end-justify-end`));
      });
      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="end" justify="space-between" style="width: 200px" value="1">Label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-end-justify-space-between`));
      });
    });

    test.describe('radio: fixed placement', () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="fixed" justify="start" style="width: 200px" value="1">This is a long label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-fixed-justify-start`));
      });
      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="fixed" justify="end" style="width: 200px" value="1">This is a long label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-fixed-justify-end`));
      });
      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `
           <ion-radio-group value="1">
             <ion-radio label-placement="fixed" justify="space-between" style="width: 200px" value="1">This is a long label</ion-radio>
           </ion-radio-group>
         `,
          config
        );

        const radio = page.locator('ion-radio');
        expect(await radio.screenshot()).toMatchSnapshot(screenshot(`radio-label-fixed-justify-space-between`));
      });
    });
  });
});
