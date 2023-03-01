import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: rendering', () => {
  test('should correctly render an unchecked radio group', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group>
        <ion-item>
          <ion-label>Pepperoni</ion-label>
          <ion-radio slot="start" value="pepperoni"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Sausage</ion-label>
          <ion-radio slot="start" value="sausage"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Pineapple</ion-label>
          <ion-radio slot="start" value="pineapple"></ion-radio>
        </ion-item>
      </ion-radio-group>
    `);

    const radioGroup = page.locator('ion-radio-group');
    await expect(radioGroup).toHaveScreenshot(`radio-group-unchecked-${page.getSnapshotSettings()}.png`);
  });
  test('should correctly render a checked radio group', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group value="sausage">
        <ion-item>
          <ion-label>Pepperoni</ion-label>
          <ion-radio slot="start" value="pepperoni"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Sausage</ion-label>
          <ion-radio slot="start" value="sausage"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Pineapple</ion-label>
          <ion-radio slot="start" value="pineapple"></ion-radio>
        </ion-item>
      </ion-radio-group>
    `);

    const radioGroup = page.locator('ion-radio-group');
    await expect(radioGroup).toHaveScreenshot(`radio-group-checked-${page.getSnapshotSettings()}.png`);
  });
  test('should allow shadow parts to be styled', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group value="sausage">
        <ion-item>
          <ion-label>Pepperoni</ion-label>
          <ion-radio slot="start" value="pepperoni"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Sausage</ion-label>
          <ion-radio slot="start" value="sausage"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Pineapple</ion-label>
          <ion-radio slot="start" value="pineapple"></ion-radio>
        </ion-item>
      </ion-radio-group>

      <style>
        ion-radio::part(container) {
          background: rgba(255, 0, 0, 0.3);
          border-color: darkred;
        }

        ion-radio::part(mark) {
          background: hotpink;
        }
      </style>
    `);

    const radioGroup = page.locator('ion-radio-group');
    await expect(radioGroup).toHaveScreenshot(`radio-group-part-${page.getSnapshotSettings()}.png`);
  });
  test('should apply color correctly', async ({ page }) => {
    await page.setContent(`
      <ion-radio slot="start" value="pepperoni" color="success"></ion-radio>
    `);

    const radio = page.locator('ion-radio');
    await radio.click();
    await page.waitForChanges();
    await expect(radio).toHaveScreenshot(`radio-color-${page.getSnapshotSettings()}.png`, { animations: 'disabled' });
  });
});

test.describe('radio: interaction', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('radio should be checked when activated', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group>
        <ion-item>
          <ion-label>Pepperoni</ion-label>
          <ion-radio slot="start" value="pepperoni"></ion-radio>
        </ion-item>
      </ion-radio-group>
    `);

    const radio = page.locator('ion-radio');
    const radioGroup = page.locator('ion-radio-group');

    await expect(radio.locator('input')).toHaveJSProperty('checked', false);
    await expect(radioGroup).toHaveJSProperty('value', undefined);

    await radio.click();
    await page.waitForChanges();

    await expect(radio.locator('input')).toHaveJSProperty('checked', true);
    await expect(radioGroup).toHaveJSProperty('value', 'pepperoni');
  });
  test('radio should be checked when activated even without a radio group', async ({ page }) => {
    await page.setContent(`
      <ion-radio slot="start" value="pepperoni"></ion-radio>
    `);

    const radio = page.locator('ion-radio');

    await expect(radio.locator('input')).toHaveJSProperty('checked', false);

    await radio.click();
    await page.waitForChanges();

    await expect(radio.locator('input')).toHaveJSProperty('checked', true);
  });
});
