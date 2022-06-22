import { test } from '@utils/test/playwright';

import { testPickerColumn } from '../test.utils';

test.describe('picker-column', () => {
  test.describe('single column', () => {
    test('should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/picker-column/test/standalone');
      await testPickerColumn(page, '#single-column-button', 'single');
    });
  });

  test.describe('multiple columns', () => {
    test('should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/picker-column/test/standalone');
      await testPickerColumn(page, '#multiple-column-button', 'multiple');
    });
  });
});
