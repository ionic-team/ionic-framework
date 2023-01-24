import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: async', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl('This is checking internal logic. RTL tests are not needed');
    skip.mode('md');
  })
  test('should correctly set the value after a delay', async ({ page }) => {
    await page.goto(`/src/components/select/test/async`);
    const selectValueSet = await page.spyOnEvent('selectValueSet');

    const select = await page.locator('#default');

    await selectValueSet.next();

    await expect(select).toHaveJSProperty('value', 'bird');
  });

  test('should re-render when options update but value is already set', async ({ page }) => {
    await page.goto(`/src/components/select/test/async`);
    const selectValueSet = await page.spyOnEvent('selectValueSet');

    const select = await page.locator('#with-value');

    await selectValueSet.next();

    await expect(select).toHaveJSProperty('value', 'bird');
    await expect(select.locator('.select-text')).toHaveText('bird');
  });
});
