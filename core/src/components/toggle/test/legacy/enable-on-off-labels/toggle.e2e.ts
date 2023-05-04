import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: enableOnOffLabels'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toggle/test/legacy/enable-on-off-labels`, config);
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(screenshot(`toggle-on-off-labels-diff`));
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: dark mode'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toggle/test/legacy/enable-on-off-labels`, config);
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

      expect(await page.screenshot()).toMatchSnapshot(screenshot(`toggle-on-off-labels-dark-mode-diff`));
    });
  });
});
