import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: color', () => {
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
   * focused input without need to wait for
   * focus events.
   */
  test.describe('input: fill none', () => {
    test('should set label and highlight color on focus with start label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-color-start-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with end label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-color-end-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-color-fixed-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(
        `input-no-fill-color-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-no-fill-color-stacked-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: fill solid', () => {
    test('should set label and highlight color on focus with start label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-color-start-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with end label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-color-end-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-color-fixed-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-color-floating-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-solid-color-stacked-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: fill outline', () => {
    test('should set label and highlight color on focus with start label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-color-start-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with end label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-color-end-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-color-fixed-${page.getSnapshotSettings()}.png`);
    });
    test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(
        `input-outline-color-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
      await page.setContent(`
        <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-input>
      `);

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(`input-outline-color-stacked-${page.getSnapshotSettings()}.png`);
    });
  });
});
