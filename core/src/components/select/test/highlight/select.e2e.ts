import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: highlights', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test.describe('input: no fill', () => {
    test('should render bottom highlight', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" class="select-expanded"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(`select-no-fill-highlight-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: solid', () => {
    test('should render bottom highlight', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="solid" label="Label" class="select-expanded"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(`select-solid-highlight-${page.getSnapshotSettings()}.png`);
    })
  });
  test.describe('input: outline', () => {
    test('should render bottom highlight', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="outline" label="Label" class="select-expanded"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(`select-outline-highlight-${page.getSnapshotSettings()}.png`);
    })
  });
});
