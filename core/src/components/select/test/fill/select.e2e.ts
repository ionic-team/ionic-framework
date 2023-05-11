import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: fill'), () => {
    test.describe('select: fill solid', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            fill="solid"
            label="Fruit"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-solid`));
      });
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            fill="solid"
            label="Fruit"
            label-placement="floating"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-solid-label-floating`));
      });
      test('should not have visual regressions with shaped solid', async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            shape="round"
            fill="solid"
            label="Fruit"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-shaped-solid`));
      });
      test('padding and border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-select {
              --border-radius: 10px !important;
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>
          <ion-select
            shape="round"
            fill="solid"
            label="Fruit"
            label-placement="floating"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-shaped-solid-custom`));
      });
    });
    test.describe('select: fill outline', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            fill="outline"
            label="Fruit"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-outline`));
      });
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            fill="outline"
            label="Fruit"
            label-placement="floating"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-outline-label-floating`));
      });
      test('should not have visual regressions with shaped outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            shape="round"
            fill="outline"
            label="Fruit"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-shaped-outline`));
      });
      test('padding and border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-select {
              --border-radius: 10px !important;
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>
          <ion-select
            shape="round"
            fill="outline"
            label="Fruit"
            label-placement="floating"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-fill-shaped-outline-custom`));
      });

      test('border radius should render evenly on both sides', async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/27116',
        });

        await page.setContent(
          `
            <style>
              ion-select {
                --border-radius: 30px !important;
              }
            </style>

            <ion-select
              fill="outline"
              label="Email"
              value="hi@ionic.io"
            ></ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        expect(await select.screenshot()).toMatchSnapshot(screenshot(`select-outline-border-radius`));
      });
    });
  });
});
