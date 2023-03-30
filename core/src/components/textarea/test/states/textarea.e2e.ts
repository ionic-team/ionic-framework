import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: states', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should render readonly textarea correctly', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" value="hi@ionic.io" readonly="true"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-readonly-${page.getSnapshotSettings()}.png`);
  });

  test('should render disabled textarea correctly', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" value="hi@ionic.io" disabled="true"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-disabled-${page.getSnapshotSettings()}.png`);
  });
});
