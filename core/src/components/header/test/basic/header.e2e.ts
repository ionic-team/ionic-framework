import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('header: basic', () => {
  test.describe('header: rendering', () => {
    test('should not have visual regressions with basic header', async ({ page }) => {
      await page.setContent(`
        <ion-header>
          <ion-toolbar>
            <ion-title>Header - Default</ion-title>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');
      expect(await header.screenshot()).toMatchSnapshot(`header-diff-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('header: feature rendering', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
    });

    test('should not have visual regressions with no border', async ({ page }) => {
      await page.setContent(`
        <ion-header class="ion-no-border">
          <ion-toolbar>
            <ion-title>Header - No Border</ion-title>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');
      expect(await header.screenshot()).toMatchSnapshot(`header-no-border-diff-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions with translucent header', async ({ page, skip }) => {
      skip.mode('md', 'Translucent effect is only available in iOS mode.');

      await page.setContent(`
        <ion-header translucent="true">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/header/test/img.jpg" />
          </div>
          <ion-toolbar>
            <ion-title>Header - Translucent</ion-title>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');
      expect(await header.screenshot()).toMatchSnapshot(`header-translucent-diff-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions with translucent header with color', async ({ page, skip }) => {
      skip.mode('md', 'Translucent effect is only available in iOS mode.');

      await page.setContent(`
        <ion-header translucent="true">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/header/test/img.jpg" />
          </div>
          <ion-toolbar color="tertiary">
            <ion-title>Header - Translucent</ion-title>
          </ion-toolbar>
        </ion-header>
      `);

      const header = page.locator('ion-header');
      expect(await header.screenshot()).toMatchSnapshot(
        `header-translucent-color-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
