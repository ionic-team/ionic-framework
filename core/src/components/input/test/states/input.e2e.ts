import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: states', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should render readonly input correctly', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" value="hi@ionic.io" readonly="true"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-readonly-${page.getSnapshotSettings()}.png`);
  });

  test('should render disabled input correctly', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" value="hi@ionic.io" disabled="true"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-disabled-${page.getSnapshotSettings()}.png`);
  });
});
