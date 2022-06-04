import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: compare-with', () => {
  test('should correctly set value when using compareWith property', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This is checking internal logic. RTL tests are not needed');

    await page.goto('/src/components/select/test/compare-with');

    const multipleSelect = await page.locator('#multiple');
    const singleSelect = await page.locator('#single');

    expect(multipleSelect).toHaveJSProperty('value', [
      {
        label: 'selected by default',
        value: '1',
      },
    ]);
    expect(singleSelect).toHaveJSProperty('value', {
      label: 'selected by default',
      value: '1',
    });
  });
});
