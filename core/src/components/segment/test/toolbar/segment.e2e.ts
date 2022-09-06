import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: toolbar', () => {
  test.describe('segment: rendering', () => {
    test('should not have visual regressions when used in a toolbar without color', async ({ page }) => {
      await page.setContent(`
        <ion-header>
          <ion-toolbar>
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');

      expect(await header.screenshot()).toMatchSnapshot(`segment-toolbar-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions when used in a toolbar with color', async ({ page }) => {
      await page.setContent(`
        <ion-header>
          <ion-toolbar color="primary">
            <ion-segment value="a">
              <ion-segment-button value="a">First</ion-segment-button>
              <ion-segment-button value="b">Second</ion-segment-button>
              <ion-segment-button value="c" disabled="true">Third</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');

      expect(await header.screenshot()).toMatchSnapshot(`segment-toolbar-color-${page.getSnapshotSettings()}.png`);
    });
  });
});
