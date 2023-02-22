import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: position', () => {
  test('should position the time picker relative to the click target', async ({ page }) => {
    await page.goto('/src/components/datetime/test/position');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const openDateTimeBtn = page.locator('ion-button#open-datetime');
    await openDateTimeBtn.click();

    await ionPopoverDidPresent.next();
    await page.waitForSelector('.datetime-ready');

    await expect(page).toHaveScreenshot(`datetime-position-base-${page.getSnapshotSettings()}.png`);

    const timepickerBtn = page.locator('ion-datetime .time-body');
    await timepickerBtn.click();

    await ionPopoverDidPresent.next();

    await expect(page).toHaveScreenshot(`datetime-position-popover-${page.getSnapshotSettings()}.png`);
  });
});
