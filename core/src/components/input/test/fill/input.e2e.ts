import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: fill', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('ios', 'Fill is only available in MD mode');
  });

  test.describe('input: fill solid', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="solid"
          label="Email"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-fill-solid-${page.getSnapshotSettings()}.png`);
    });
    test('should render correctly with floating label', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="solid"
          label="Email"
          label-placement="floating"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(
        `input-fill-solid-label-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should not have visual regressions with shaped solid', async ({ page }) => {
      await page.setContent(`
        <ion-input
          shape="round"
          fill="solid"
          label="Email"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-fill-shaped-solid-${page.getSnapshotSettings()}.png`);
    });
    test('padding and border radius should be customizable', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-input {
            --border-radius: 10px !important;
            --padding-start: 50px !important;
            --padding-end: 50px !important;
          }
        </style>

        <ion-input
          shape="round"
          fill="solid"
          label="Email"
          label-placement="floating"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(
        `input-fill-shaped-solid-custom-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('input: fill outline', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="outline"
          label="Email"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-fill-outline-${page.getSnapshotSettings()}.png`);
    });
    test('should render correctly with floating label', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="outline"
          label="Email"
          label-placement="floating"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(
        `input-fill-outline-label-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should not have visual regressions with shaped outline', async ({ page }) => {
      await page.setContent(`
        <ion-input
          shape="round"
          fill="outline"
          label="Email"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-fill-shaped-outline-${page.getSnapshotSettings()}.png`);
    });
    test('padding and border radius should be customizable', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-input {
            --border-radius: 10px !important;
            --padding-start: 50px !important;
            --padding-end: 50px !important;
          }
        </style>

        <ion-input
          shape="round"
          fill="outline"
          label="Email"
          label-placement="floating"
          value="hi@ionic.io"
          helper-text="Enter your email"
          maxlength="20"
          counter="true"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(
        `input-fill-shaped-outline-custom-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
