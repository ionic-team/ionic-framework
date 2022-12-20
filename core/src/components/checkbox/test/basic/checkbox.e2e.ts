import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/checkbox/test/basic`);

    const content = page.locator('#checkboxes');
    expect(await content.screenshot()).toMatchSnapshot(`checkbox-basic-${page.getSnapshotSettings()}.png`);
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
