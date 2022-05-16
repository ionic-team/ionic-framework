import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: async', () => {
  test('should correctly set the value after a delay', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This is checking internal logic. RTL tests are not needed');

    await page.goto(`/src/components/select/test/async`);
    const selectValueSet = await page.spyOnEvent('selectValueSet');

    const select = await page.locator('#default');

    await selectValueSet.next();

    expect(select).toHaveJSProperty('value', 'bird');
  });
});
