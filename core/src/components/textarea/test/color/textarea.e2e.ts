import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: color', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode(
      'ios',
      'iOS does not have any color theming besides the caret which cannot be captured in a stable manner in screenshots.'
    );
  });

  /**
   * Manually setting the .has-focus class
   * lets us quickly test the rendering of a
   * focused textarea without need to wait for
   * focus events.
   */
  test.describe('textarea: fill none', () => {
    test('should set label and highlight color on focus with start label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-no-fill-color-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with end label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-no-fill-color-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-no-fill-color-fixed-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-no-fill-color-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-no-fill-color-stacked-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('textarea: fill solid', () => {
    test('should set label and highlight color on focus with start label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-solid-color-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with end label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(`textarea-solid-color-end-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-solid-color-fixed-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-solid-color-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-solid-color-stacked-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('textarea: fill outline', () => {
    test('should set label and highlight color on focus with start label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-outline-color-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with end label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-outline-color-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-outline-color-fixed-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-outline-color-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
      await page.setContent(`
        <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-textarea>
      `);

      const textarea = page.locator('ion-textarea');
      expect(await textarea.screenshot()).toMatchSnapshot(
        `textarea-outline-color-stacked-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
