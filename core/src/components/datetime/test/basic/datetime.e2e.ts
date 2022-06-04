import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: selecting a day', () => {
  const testHighlight = async (page: E2EPage, datetimeID: string) => {
    const today = new Date();
    await page.goto('/src/components/datetime/test/basic');
    await page.setIonViewport();

    const todayBtn = page.locator(
      `#${datetimeID} .calendar-day[data-day='${today.getDate()}'][data-month='${today.getMonth() + 1}']`
    );

    expect(todayBtn).toHaveClass(/calendar-day-today/);
    expect(todayBtn).not.toHaveClass(/calendar-day-active/);

    await todayBtn.click();
    await page.waitForChanges();

    expect(todayBtn).toHaveClass(/calendar-day-active/);
  };

  test('should not highlight a day until one is selected', async ({ page }) => {
    await testHighlight(page, 'inline-datetime-no-value');
  });

  test('should not highlight a day until one is selected, with default-buttons', async ({ page }) => {
    await testHighlight(page, 'custom-datetime');
  });
});

test.describe('datetime: confirm date', () => {
  test('should not update value if Done was clicked without selecting a day first', async ({ page }) => {
    await page.goto('/src/components/datetime/test/basic');

    const datetime = page.locator('#custom-datetime');

    const value = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
    expect(value).toBeUndefined();

    await datetime.evaluate(async (el: HTMLIonDatetimeElement) => {
      await el.confirm();
    });
    const valueAgain = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
    expect(valueAgain).toBeUndefined();
  });
});
