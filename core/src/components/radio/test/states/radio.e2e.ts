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

  test('should render focused radio correctly', async ({ page, skip }) => {
    skip.mode('ios', 'iOS does not have focused styling');
    await page.setContent(`
      <ion-radio-group>
        <ion-radio class="ion-focused" value="true">Label</ion-radio>
      </ion-radio-group>
      <style>
        ion-radio {
          padding: 0px 8px;
        }
      </style>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `radio-focused-${page.getSnapshotSettings()}.png`
    );
  });

  test('should render activated radio correctly', async ({ page, skip }) => {
    skip.mode('ios', 'iOS does not have activated styling');
    await page.setContent(`
      <ion-radio-group>
        <ion-radio class="ion-activated" value="true">Label</ion-radio>
      </ion-radio-group>
      <style>
        ion-radio {
          padding: 0px 8px;
        }
      </style>
    `);

    const radio = page.locator('ion-radio');
    expect(await radio.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `radio-activated-${page.getSnapshotSettings()}.png`
    );
  });
});
