import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  configs().forEach(({ title, config }) => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/basic`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`accordion-basic-${page.getSnapshotSettings()}.png`);
    });
  });
});
