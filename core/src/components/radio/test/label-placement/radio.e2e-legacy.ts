import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

/**
 * By default ion-radio only takes up
 * as much space as it needs. Justification is
 * used for when the radio takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the radio so we can
 * see the justification results.
 */
test.describe('radio: label', () => {
  test.describe('radio: start placement', () => {
    test('should render a start justification with label in the start position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="start" justify="start" style="width: 200px" value="1">Label</ion-radio>
        </ion-radio-group>
        `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-start-justify-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render an end justification with label in the start position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="start" justify="end" style="width: 200px" value="1">Label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-start-justify-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render a space between justification with label in the start position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="start" justify="space-between" style="width: 200px" value="1">Label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-start-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('radio: end placement', () => {
    test('should render a start justification with label in the end position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="end" justify="start" style="width: 200px" value="1">Label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-end-justify-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render an end justification with label in the end position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="end" justify="end" style="width: 200px" value="1">Label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(`radio-label-end-justify-end-${page.getSnapshotSettings()}.png`);
    });
    test('should render a space between justification with label in the end position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="end" justify="space-between" style="width: 200px" value="1">Label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-end-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('radio: fixed placement', () => {
    test('should render a start justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="fixed" justify="start" style="width: 200px" value="1">This is a long label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-fixed-justify-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render an end justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="fixed" justify="end" style="width: 200px" value="1">This is a long label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-fixed-justify-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render a space between justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="1">
          <ion-radio label-placement="fixed" justify="space-between" style="width: 200px" value="1">This is a long label</ion-radio>
        </ion-radio-group>
      `);

      const radio = page.locator('ion-radio');
      expect(await radio.screenshot()).toMatchSnapshot(
        `radio-label-fixed-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
