import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('footer: basic', () => {
  test.describe('footer: rendering', () => {
    test('should not have visual regressions with basic footer', async ({ page }) => {
      await page.setContent(`
        <ion-footer>
          <ion-toolbar>
            <ion-title>Footer - Default</ion-title>
          </ion-toolbar>
        </ion-footer>
      `);

      const footer = page.locator('ion-footer');
      expect(await footer.screenshot()).toMatchSnapshot(`footer-diff-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('footer: feature rendering', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
    });

    test('should not have visual regressions with no border', async ({ page }) => {
      await page.setContent(`
        <ion-footer class="ion-no-border">
          <ion-toolbar>
            <ion-title>Footer - No Border</ion-title>
          </ion-toolbar>
        </ion-footer>
      `);

      const footer = page.locator('ion-footer');
      expect(await footer.screenshot()).toMatchSnapshot(`footer-no-border-diff-${page.getSnapshotSettings()}.png`);
    });

    test('should not have visual regressions with translucent footer', async ({ page, skip }) => {
      skip.mode('md', 'Translucent effect is only available in iOS mode.');

      await page.setContent(`
        <ion-footer translucent="true">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/footer/test/img.jpg" />
          </div>
          <ion-toolbar>
            <ion-title>Footer - Translucent</ion-title>
          </ion-toolbar>
        </ion-footer>
      `);

      const footer = page.locator('ion-footer');
      expect(await footer.screenshot()).toMatchSnapshot(`footer-translucent-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
