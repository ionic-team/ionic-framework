import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('select: single-value', () => {
    test(title('should open single value select'), async ({ page }) => {
      await page.goto(`/src/components/select/test/single-value`, config);

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await page.click('#gender');

      await ionAlertDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`select-single-value-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
