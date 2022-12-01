import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('header: basic', () => {
  configs().forEach(({ title, config }) => {
    test.describe('header: rendering', () => {
      test(title('should not have visual regressions with basic header'), async ({ page }) => {
        await page.setContent(
          `
          <ion-header>
            <ion-toolbar>
              <ion-title>Header - Default</ion-title>
            </ion-toolbar>
          </ion-header>
        `,
          config
        );

        const header = page.locator('ion-header');
        expect(await header.screenshot()).toMatchSnapshot(`header-diff-${page.getSnapshotSettings()}.png`);
      });
    });
  });

  test.describe('header: feature rendering', () => {
    configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
      test.describe('header: no border', () => {
        test(title('should not have visual regressions with no border'), async ({ page }) => {
          await page.setContent(
            `
              <ion-header class="ion-no-border">
                <ion-toolbar>
                  <ion-title>Header - No Border</ion-title>
                </ion-toolbar>
              </ion-header>
            `,
            config
          );

          const header = page.locator('ion-header');
          expect(await header.screenshot()).toMatchSnapshot(`header-no-border-diff-${page.getSnapshotSettings()}.png`);
        });
      });
    });

    configs({ modes: ['ios'] }).forEach(({ title, config }) => {
      test.describe('header: translucent', () => {
        test.beforeEach(({ skip }) => {
          skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');
        });
        test(title('should not have visual regressions with translucent header'), async ({ page }) => {
          await page.setContent(
            `
              <ion-header translucent="true">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
                  <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/header/test/img.jpg" />
                </div>
                <ion-toolbar>
                  <ion-title>Header - Translucent</ion-title>
                </ion-toolbar>
              </ion-header>
            `,
            config
          );

          const header = page.locator('ion-header');
          expect(await header.screenshot()).toMatchSnapshot(
            `header-translucent-diff-${page.getSnapshotSettings()}.png`
          );
        });

        test(title('should not have visual regressions with translucent header with color'), async ({ page }) => {
          await page.setContent(
            `
              <ion-header translucent="true">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
                  <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/header/test/img.jpg" />
                </div>
                <ion-toolbar color="tertiary">
                  <ion-title>Header - Translucent</ion-title>
                </ion-toolbar>
              </ion-header>
            `,
            config
          );

          const header = page.locator('ion-header');
          expect(await header.screenshot()).toMatchSnapshot(
            `header-translucent-color-diff-${page.getSnapshotSettings()}.png`
          );
        });
      });
    });
  });
});
