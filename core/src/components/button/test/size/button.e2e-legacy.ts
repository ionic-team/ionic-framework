import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: size', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render small buttons', async ({ page }) => {
    await page.setContent(`
      <ion-button size="small" fill="solid">Small Button</ion-button>
    `);

    const wrapper = page.locator('ion-button');

    await expect(wrapper).toHaveScreenshot(`button-size-small-${page.getSnapshotSettings()}.png`);
  });
  test('should render large buttons', async ({ page }) => {
    await page.setContent(`
      <ion-button size="large" fill="solid">Large Button</ion-button>
    `);

    const wrapper = page.locator('ion-button');

    await expect(wrapper).toHaveScreenshot(`button-size-large-${page.getSnapshotSettings()}.png`);
  });
  test.describe('in ion-buttons', () => {
    test('should render small button', async ({ page }) => {
      await page.setContent(`
        <ion-buttons>
          <ion-button size="small" fill="solid">Small Button</ion-button>
        </ion-buttons>
      `);

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(`button-size-small-in-buttons-${page.getSnapshotSettings()}.png`);
    });
    test('should render large button', async ({ page }) => {
      await page.setContent(`
        <ion-buttons>
          <ion-button size="large" fill="solid">Large Button</ion-button>
        </ion-buttons>
      `);

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(`button-size-large-in-buttons-${page.getSnapshotSettings()}.png`);
    });
  });
});
