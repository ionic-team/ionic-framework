import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('thumbnail: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/thumbnail/test/basic`);
  });
  test('should not have visual regressions when rendering <img>', async ({ page, skip }) => {
    skip.rtl('ion-thumbnail does not have RTL-specific logic');
    skip.mode('md', 'ion-thumbnail does not have mode-specific logic');

    const referenceEl = page.locator('#img');

    await expect(referenceEl).toHaveScreenshot(`thumbnail-img-diff-${page.getSnapshotSettings()}.png`);
  });

  /**
   * ion-item has mode and RTL specific logic
   * for ion-thumbnail which is why we do not skip
   * RTL and mode tests here.
   */
  test('should not have visual regressions when rendering inside of an <ion-item>', async ({ page }) => {
    const referenceEl = page.locator('#ion-item');

    await expect(referenceEl).toHaveScreenshot(`thumbnail-ion-item-diff-${page.getSnapshotSettings()}.png`);
  });

  test('size should be customizable in <ion-item>', async ({ page, skip }) => {
    skip.rtl();

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/22935',
    });

    await page.setContent(`
      <ion-item>
        <ion-thumbnail style="--size: 20px">
          <img src="/src/components/thumbnail/test/thumbnail.svg" />
        </ion-thumbnail>
      </ion-item>
    `);

    const item = page.locator('ion-item');
    await expect(item).toHaveScreenshot(`thumbnail-ion-item-size-diff-${page.getSnapshotSettings()}.png`);
  });
});
