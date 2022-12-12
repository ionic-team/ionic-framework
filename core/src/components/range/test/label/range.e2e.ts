import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: label', () => {
  test.describe('range: no start or end items', () => {
    test('should render a range with no visible label', async ({ page }) => {
      await page.setContent(`
        <ion-range></ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-no-items-no-label-${page.getSnapshotSettings()}.png`);
    });
    test('should render label in the start placement', async ({ page }) => {
      await page.setContent(`
        <ion-range label-placement="start">
          <span slot="label">Volume</span>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-no-items-start-${page.getSnapshotSettings()}.png`);
    });
    test('should render label in the end placement', async ({ page }) => {
      await page.setContent(`
        <ion-range label-placement="end">
          <span slot="label">Volume</span>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-no-items-end-${page.getSnapshotSettings()}.png`);
    });
    test('should render label in the fixed placement', async ({ page }) => {
      await page.setContent(`
        <ion-range label-placement="fixed">
          <span slot="label">Volume</span>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-no-items-fixed-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('range: start and end items', () => {
    test('should render a range with no visible label', async ({ page }) => {
      await page.setContent(`
        <ion-range>
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-items-no-label-${page.getSnapshotSettings()}.png`);
    });
    test('should render label in the start placement', async ({ page }) => {
      await page.setContent(`
        <ion-range label-placement="start">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Volume</span>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-items-start-${page.getSnapshotSettings()}.png`);
    });
    test('should render label in the end placement', async ({ page }) => {
      await page.setContent(`
        <ion-range label-placement="end">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Volume</span>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-items-end-${page.getSnapshotSettings()}.png`);
    });
    test('should render label in the fixed placement', async ({ page }) => {
      await page.setContent(`
        <ion-range label-placement="fixed">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Volume</span>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-items-fixed-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('range: label overflow', () => {
    test('label should be truncated with ellipses', async ({ page, skip }) => {
      skip.mode('ios');
      skip.rtl();

      await page.setContent(`
        <ion-range>
          <div slot="label">Temperature Temperature Temperature Temperature Temperature Temperature</div>
        </ion-range>
      `);

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(`range-label-truncate-${page.getSnapshotSettings()}.png`);
    });
  });
});
