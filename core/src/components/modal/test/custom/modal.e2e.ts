import { expect } from '@playwright/test';
import { test, Viewports, configs } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('modal: custom rendering', () => {
    const runVisualTests = async (page: E2EPage, screenshotModifier = '') => {
      await page.goto('/src/components/modal/test/custom', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#custom-modal');

      await ionModalDidPresent.next();

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(
        `modal-custom-present-${screenshotModifier}${page.getSnapshotSettings()}.png`
      );
    };
    test(title('should not have visual regressions'), async ({ page }) => {
      await runVisualTests(page);
    });

    test(title('should not have visual regressions with tablet viewport'), async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await runVisualTests(page, 'tablet-');
    });
  });
});
