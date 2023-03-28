import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item-divider: spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/item-divider/test/spec');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`list-item-divider-${page.getSnapshotSettings()}.png`);
  });

  test('should have margin-end on button in end slot', async ({ page, skip }) => {
    skip.mode('ios', 'This behavior is only available in MD mode.');

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/17012',
    });

    const button = page.locator('ion-button');
    const buttonMarginEnd = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.getPropertyValue('margin-end');
    });

    expect(buttonMarginEnd).not.toBe('0px');
  });
});
