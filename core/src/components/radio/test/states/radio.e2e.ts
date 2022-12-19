import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: states', () => {
  test('should render disabled checked radio correctly', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-radio-group value="1">
        <ion-radio disabled="true" value="1">Label</ion-radio>
      </ion-radio-group>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot()).toMatchSnapshot(`radio-checked-disabled-${page.getSnapshotSettings()}.png`);
  });

  test('should render checked radio correctly', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group value="true">
        <ion-radio value="true">Label</ion-radio>
      </ion-radio-group>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot()).toMatchSnapshot(`radio-checked-${page.getSnapshotSettings()}.png`);
  });

  test('should render unchecked radio correctly', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group>
        <ion-radio value="true">Label</ion-radio>
      </ion-radio-group>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot()).toMatchSnapshot(`radio-unchecked-${page.getSnapshotSettings()}.png`);
  });
});
