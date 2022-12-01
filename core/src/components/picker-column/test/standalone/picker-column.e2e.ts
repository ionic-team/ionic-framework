import { test, configs } from '@utils/test/playwright';

import { testPickerColumn } from '../test.utils';

configs().forEach(({ title, config }) => {
  test.describe('picker-column', () => {
    test.describe('single column', () => {
      test(title('should not have any visual regressions'), async ({ page }) => {
        await page.goto('/src/components/picker-column/test/standalone', config);
        await testPickerColumn(page, '#single-column-button', 'single');
      });
    });

    test.describe('multiple columns', () => {
      test(title('should not have any visual regressions'), async ({ page }) => {
        await page.goto('/src/components/picker-column/test/standalone', config);
        await testPickerColumn(page, '#multiple-column-button', 'multiple');
      });
    });
  });
});
