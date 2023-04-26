import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

/**
 * By default ion-checkbox only takes up
 * as much space as it needs. Justification is
 * used for when the checkbox takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the checkbox so we can
 * see the justification results.
 */
test.describe('checkbox: label', () => {
  test.describe('checkbox: start placement', () => {
    test('should render a start justification with label in the start position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="start" justify="start" style="width: 200px">Label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-start-justify-start-${page.getSnapshotSettings()}.png`
      );
    });

    test('should render an end justification with label in the start position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="start" justify="end" style="width: 200px">Label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-start-justify-end-${page.getSnapshotSettings()}.png`
      );
    });

    test('should render a space between justification with label in the start position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="start" justify="space-between" style="width: 200px">Label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-start-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });

    test('should truncate long labels with ellipses', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="start" justify="start" style="width: 200px">
          Long Label Long Label Long Label Long Label Long Label Long Label
        </ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(`checkbox-long-label-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('checkbox: end placement', () => {
    test('should render a start justification with label in the end position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="end" justify="start" style="width: 200px">Label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-end-justify-start-${page.getSnapshotSettings()}.png`
      );
    });

    test('should render an end justification with label in the end position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="end" justify="end" style="width: 200px">Label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-end-justify-end-${page.getSnapshotSettings()}.png`
      );
    });

    test('should render a space between justification with label in the end position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="end" justify="space-between" style="width: 200px">Label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-end-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('checkbox: fixed placement', () => {
    test('should render a start justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="fixed" justify="start" style="width: 200px">This is a long label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-fixed-justify-start-${page.getSnapshotSettings()}.png`
      );
    });

    test('should render an end justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="fixed" justify="end" style="width: 200px">This is a long label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-fixed-justify-end-${page.getSnapshotSettings()}.png`
      );
    });

    test('should render a space between justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`
        <ion-checkbox label-placement="fixed" justify="space-between" style="width: 200px">This is a long label</ion-checkbox>
      `);

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(
        `checkbox-label-fixed-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
