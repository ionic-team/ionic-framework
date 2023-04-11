import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: basic', () => {
  test.describe('segment: rendering', () => {
    test('should not have visual regressions when no value is selected', async ({ page }) => {
      await page.setContent(`
        <ion-segment>
          <ion-segment-button value="a">First</ion-segment-button>
          <ion-segment-button value="b">Second</ion-segment-button>
          <ion-segment-button value="c">Third</ion-segment-button>
        </ion-segment>
      `);

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(`segment-no-value-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions when a value is selected', async ({ page }) => {
      await page.setContent(`
        <ion-segment value="a">
          <ion-segment-button value="a">First</ion-segment-button>
          <ion-segment-button value="b">Second</ion-segment-button>
          <ion-segment-button value="c">Third</ion-segment-button>
        </ion-segment>
      `);

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(`segment-value-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions when an item is disabled', async ({ page }) => {
      await page.setContent(`
        <ion-segment value="b">
          <ion-segment-button value="a">First</ion-segment-button>
          <ion-segment-button value="b" disabled="true">Second</ion-segment-button>
          <ion-segment-button value="c">Third</ion-segment-button>
        </ion-segment>
      `);

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(`segment-disabled-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions with color', async ({ page }) => {
      await page.setContent(`
        <ion-segment value="b" color="danger">
          <ion-segment-button value="a">First</ion-segment-button>
          <ion-segment-button value="b">Second</ion-segment-button>
          <ion-segment-button value="c">Third</ion-segment-button>
        </ion-segment>
      `);

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(`segment-color-${page.getSnapshotSettings()}.png`);
    });
  });
});
