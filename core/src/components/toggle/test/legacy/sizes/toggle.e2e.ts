import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: sizes'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toggle/test/legacy/sizes`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(screenshot(`toggle-sizes-diff`));
    });
  });
});
