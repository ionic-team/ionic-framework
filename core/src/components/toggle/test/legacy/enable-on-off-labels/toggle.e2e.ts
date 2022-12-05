import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: enableOnOffLabels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/toggle/test/legacy/enable-on-off-labels`);
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`toggle-on-off-labels-diff-${page.getSnapshotSettings()}.png`);
  });

  test.describe('dark mode', () => {
    test('should not have visual regressions', async ({ page }) => {
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#dark-mode');

      await page.evaluate(() => {
        const popover = document.querySelector('ion-popover');
        return popover?.dismiss();
      });
      await ionPopoverDidDismiss.next();

      await page.waitForChanges();

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(
        `toggle-on-off-labels-dark-mode-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
