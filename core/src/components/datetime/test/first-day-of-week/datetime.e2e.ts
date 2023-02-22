import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: first day of the week', () => {
  test('should set the first day of the week correctly', async ({ page }) => {
    await page.goto('/src/components/datetime/test/first-day-of-week');

    const datetime = page.locator('ion-datetime');
    await expect(datetime).toHaveScreenshot(`datetime-day-of-week-${page.getSnapshotSettings()}.png`);
  });
});
