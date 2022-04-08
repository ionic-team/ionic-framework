import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: opening with custom button', () => {
  test('should open date picker when clicking on custom date button', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/buttons');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const dateButton = await page.locator('#custom-date-button');
    await dateButton.click();

    await ionPopoverDidPresent.next();

    const datetime = await page.locator('ion-datetime');
    expect(datetime).toHaveClass(/datetime-presentation-date/);
  });

  test('should open date picker when clicking on custom time button', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/buttons');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const timeButton = await page.locator('#custom-time-button');
    await timeButton.click();

    await ionPopoverDidPresent.next();

    const datetime = await page.locator('ion-datetime');
    expect(datetime).toHaveClass(/datetime-presentation-time/);
  });
});
