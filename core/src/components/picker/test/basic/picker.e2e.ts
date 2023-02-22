import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/picker/test/basic');
    const didPresent = await page.spyOnEvent('ionPickerDidPresent');
    const didDismiss = await page.spyOnEvent('ionPickerDidDismiss');

    await page.click('#basic');
    await didPresent.next();
    await page.waitForChanges();

    await expect(page).toHaveScreenshot(`picker-basic-${page.getSnapshotSettings()}.png`);

    await page.click('.picker-opt:nth-child(2)');
    await page.click('ion-picker .save-btn');
    await didDismiss.next();

    await page.click('#basic');
    await didPresent.next();
    await page.waitForChanges();

    await expect(page).toHaveScreenshot(`picker-value-selected-${page.getSnapshotSettings()}.png`);
  });
});
