import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: selecting a day', () => {
  const testHighlight = async (page: E2EPage, datetimeID: string) => {
    const today = new Date();
    await page.goto('/src/components/datetime/test/basic');

    const todayBtn = page.locator(
      `#${datetimeID} >>> .calendar-day[data-day="${today.getDate()}"][data-month="${today.getMonth() + 1}"]`
    );

    const classes = await todayBtn.evaluate((el: any) => el.classList.value);
    expect(classes).toMatch('calendar-day-today');
    expect(classes).not.toMatch('calendar-day-active');
  };

  test('should not highlight a day until one is selected', async ({ page }) => {
    await testHighlight(page, 'inline-datetime-no-value');
  });

  test('should not highlight a day until one is selected, with default-buttons', async ({ page }) => {
    await testHighlight(page, 'custom-datetime');
  });
});