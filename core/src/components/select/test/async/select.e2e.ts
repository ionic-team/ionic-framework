import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

// TODO: This test is extremely flaky
test.skip('select: async', () => {
  test('should correctly set the value after a delay', async ({ page, skip }) => {
    skip.rtl('This is checking internal logic. RTL tests are not needed');

    await page.goto(`/src/components/select/test/async`);
    const selectValueSet = await page.spyOnEvent('selectValueSet');

    const select = await page.locator('#default');

    await selectValueSet.next();

    await expect(select).toHaveJSProperty('value', 'bird');
  });
});
