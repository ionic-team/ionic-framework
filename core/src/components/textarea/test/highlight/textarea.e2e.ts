import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: highlights', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test.describe('textarea: no fill', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          value="hi@ionic.io"
          class="ion-valid has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-no-fill-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          value="hi@ionic.io"
          class="ion-touched ion-invalid"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-no-fill-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          value="hi@ionic.io"
          class="has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-no-fill-focus-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('textarea: solid', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          fill="solid"
          value="hi@ionic.io"
          class="ion-valid has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-solid-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          fill="solid"
          value="hi@ionic.io"
          class="ion-touched ion-invalid"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-solid-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          fill="solid"
          value="hi@ionic.io"
          class="has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-solid-focus-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('textarea: outline', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          fill="outline"
          value="hi@ionic.io"
          class="ion-valid has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-outline-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          fill="outline"
          value="hi@ionic.io"
          class="ion-touched ion-invalid"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-outline-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-textarea
          fill="outline"
          value="hi@ionic.io"
          class="has-focus"
          label="Email"
          error-text="Please enter a valid email"
          helper-text="Enter an email"
          counter="true"
          maxlength="20"
        ></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-outline-focus-${page.getSnapshotSettings()}.png`);
    });
  });
});
