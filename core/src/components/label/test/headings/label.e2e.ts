import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('label: rendering', () => {
    test(title('should inherit text overflow for headings'), async ({ page }) => {
      await page.goto(`/src/components/label/test/headings`, config);

      expect(await page.screenshot()).toMatchSnapshot(`item-headings-inherit-${page.getSnapshotSettings()}.png`);
    });
  });
});
