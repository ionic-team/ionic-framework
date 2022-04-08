import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: disabled buttons', () => {
  test('default buttons should be disabled', async ({ page }) => {
    await page.goto('/src/components/datetime-button/test/disabled');

    const dateButton = await page.locator('ion-datetime-button#default-button #date-button');
    expect(dateButton).toBeDisabled();

    const timeButton = await page.locator('ion-datetime-button#default-button #time-button');
    expect(timeButton).toBeDisabled();
  });
});
