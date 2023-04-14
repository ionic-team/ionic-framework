import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

/**
 * Clear buttons have special font-weight
 * styles which is why we make sure
 * to capture the clear button here.
 */
test.describe('button: strong', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render strong button', async ({ page }) => {
    await page.setContent(`
      <ion-button fill="solid" strong="true">Button</ion-button>
    `);

    const wrapper = page.locator('ion-button');

    await expect(wrapper).toHaveScreenshot(`button-strong-${page.getSnapshotSettings()}.png`);
  });
  test('should render strong clear button', async ({ page }) => {
    await page.setContent(`
      <ion-button fill="clear" strong="true">Button</ion-button>
    `);

    const wrapper = page.locator('ion-button');

    await expect(wrapper).toHaveScreenshot(`button-clear-strong-${page.getSnapshotSettings()}.png`);
  });
  test.describe('in ion-buttons', () => {
    test('should render strong button', async ({ page }) => {
      await page.setContent(`
        <ion-buttons>
          <ion-button strong="true" fill="solid">Button</ion-button>
        </ion-buttons>
      `);

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(`button-strong-in-buttons-${page.getSnapshotSettings()}.png`);
    });
    test('should render strong clear button', async ({ page }) => {
      await page.setContent(`
        <ion-buttons>
          <ion-button strong="true" fill="clear">Button</ion-button>
        </ion-buttons>
      `);

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(`button-clear-strong-in-buttons-${page.getSnapshotSettings()}.png`);
    });
  });
});
