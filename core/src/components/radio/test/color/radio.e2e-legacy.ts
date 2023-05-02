import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: color', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should apply color when checked', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group value="1">
        <ion-radio color="danger" value="1">Label</ion-radio>
      </ion-radio-group>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot()).toMatchSnapshot(`radio-color-checked-${page.getSnapshotSettings()}.png`);
  });

  test('should not apply color when unchecked', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group>
        <ion-radio color="danger" value="1">Label</ion-radio>
      </ion-radio-group>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot()).toMatchSnapshot(`radio-color-unchecked-${page.getSnapshotSettings()}.png`);
  });
});
