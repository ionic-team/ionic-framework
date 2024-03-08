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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-solid`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-solid-label-floating`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-shaped-solid`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-shaped-solid-custom`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-outline`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-outline-label-floating`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-shaped-outline`));
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
        await expect(select).toHaveScreenshot(screenshot(`select-fill-shaped-outline-custom`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: label slot'), () => {
    test('should render the notch correctly with a slotted label', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .custom-label {
            font-size: 30px;
          }
        </style>
        <ion-select
          fill="outline"
          label-placement="stacked"
          value="apple"
        >
          <div slot="label" class="custom-label">My Label Content</div>
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-fill-outline-slotted-label`));
    });
    test('should render the notch correctly with a slotted label after the select was originally hidden', async ({
      page,
    }) => {
      await page.setContent(
        `
        <style>
          .custom-label {
            font-size: 30px;
          }
        </style>
        <ion-select
          fill="outline"
          label-placement="stacked"
          value="apple"
          style="display: none"
        >
          <div slot="label" class="custom-label">My Label Content</div>
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select');

      await select.evaluate((el: HTMLIonSelectElement) => el.style.removeProperty('display'));

      await expect(select).toHaveScreenshot(screenshot(`select-fill-outline-hidden-slotted-label`));
    });
  });
  test.describe(title('select: notch cutout'), () => {
    test('notch cutout should be hidden when no label is passed', async ({ page }) => {
      await page.setContent(
        `
        <ion-select fill="outline" label-placement="stacked" aria-label="my select"></ion-select>
      `,
        config
      );

      const notchCutout = page.locator('ion-select .select-outline-notch');
      await expect(notchCutout).toBeHidden();
    });
  });
});
