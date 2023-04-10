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

  test.describe('segment: behavior', () => {
    test.only('segment buttons should be disabled when added to disabled segment asyncronously', async ({ page, skip }) => {
      skip.rtl();
      skip.mode('ios');

      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25396',
      });

      await page.setContent(`
        <ion-segment disabled="true"></ion-segment>
        <script>
          const segment = document.querySelector('ion-segment');
          setTimeout(() => {
            segment.insertAdjacentHTML('beforeend', '<ion-segment-button>Segment</ion-segment-button>');
          }, 500); // shorter times don't trigger the issue consistently enough
        </script>
      `);

      const segmentButton = page.locator('ion-segment-button');
      await expect(segmentButton).toBeVisible();

      await expect(segmentButton).toHaveClass(/segment-button-disabled/);
    });
  });
});
