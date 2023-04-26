import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: basic visual tests', () => {
  test('should render unchecked checkbox correctly', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox>Unchecked</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    await expect(checkbox).toHaveScreenshot(`checkbox-unchecked-${page.getSnapshotSettings()}.png`);
  });

  test('should render checked checkbox correctly', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox checked>Checked</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    await expect(checkbox).toHaveScreenshot(`checkbox-checked-${page.getSnapshotSettings()}.png`);
  });

  test('should render disabled checkbox correctly', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox checked disabled>Disabled</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    await expect(checkbox).toHaveScreenshot(`checkbox-disabled-${page.getSnapshotSettings()}.png`);
  });

  test('should render custom checkmark-width correctly', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox checked style="--checkmark-width: 7">Checkmark Width</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    await expect(checkbox).toHaveScreenshot(`checkbox-checkmark-width-${page.getSnapshotSettings()}.png`);
  });

  test('should render custom size correctly', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox checked style="--size: 100px">Size</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    await expect(checkbox).toHaveScreenshot(`checkbox-size-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('checkbox: ionChange', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test('should fire ionChange when interacting with checkbox', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
    `);

    const ionChange = await page.spyOnEvent('ionChange');
    const checkbox = page.locator('ion-checkbox');

    await checkbox.click();
    expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: true });

    await checkbox.click();
    expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: false });
  });

  test('should fire ionChange when interacting with checkbox in item', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
      </ion-item>
    `);

    const ionChange = await page.spyOnEvent('ionChange');
    const item = page.locator('ion-item');

    await item.click();
    expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: true });

    await item.click();
    expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: false });
  });

  test('should not fire when programmatically setting a value', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
    `);

    const ionChange = await page.spyOnEvent('ionChange');
    const checkbox = page.locator('ion-checkbox');

    await checkbox.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
    expect(ionChange).not.toHaveReceivedEvent();
  });
});
