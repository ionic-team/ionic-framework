import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: highlights', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test.describe('input: no fill', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          value="hi@ionic.io"
          class="ion-touched ion-valid has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          value="hi@ionic.io"
          class="ion-touched ion-invalid"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          value="hi@ionic.io"
          class="has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-focus-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: solid', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="solid"
          value="hi@ionic.io"
          class="ion-touched ion-valid has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="solid"
          value="hi@ionic.io"
          class="ion-touched ion-invalid"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="solid"
          value="hi@ionic.io"
          class="has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-focus-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: outline', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="outline"
          value="hi@ionic.io"
          class="ion-touched ion-valid has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="outline"
          value="hi@ionic.io"
          class="ion-touched ion-invalid"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-input
          fill="outline"
          value="hi@ionic.io"
          class="has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-focus-${page.getSnapshotSettings()}.png`);
    });
  });
});
