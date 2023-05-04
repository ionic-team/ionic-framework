import { configs, test } from '@utils/test/playwright';

import { testPickerColumn } from '../test.utils';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/standalone', config);
    });
    test.describe('single column', () => {
      test('should not have any visual regressions', async ({ page }) => {
        await testPickerColumn(page, screenshot, '#single-column-button', 'single');
      });
    });

    test.describe('multiple columns', () => {
      test('should not have any visual regressions', async ({ page }) => {
        await testPickerColumn(page, screenshot, '#multiple-column-button', 'multiple');
      });
    });
  });
});
