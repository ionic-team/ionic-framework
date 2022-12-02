import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('datetime: position', () => {
    test(title('should position the time picker relative to the click target'), async ({ page }) => {
      await page.goto('/src/components/datetime/test/position', config);
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      const openDateTimeBtn = page.locator('ion-button#open-datetime');
      await openDateTimeBtn.click();

      await ionPopoverDidPresent.next();
      await page.waitForSelector('.datetime-ready');

      expect(await page.screenshot()).toMatchSnapshot(`datetime-position-base-${page.getSnapshotSettings()}.png`);

      const timepickerBtn = page.locator('ion-datetime .time-body');
      await timepickerBtn.click();

      await ionPopoverDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`datetime-position-popover-${page.getSnapshotSettings()}.png`);
    });
  });
});
