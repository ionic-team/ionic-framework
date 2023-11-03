import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: custom'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/datetime/test/custom`, config);
    });

    test('should allow styling wheel style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-wheel');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-wheel`));
    });

    test('should allow styling time picker in grid style datetimes', async ({ page }) => {
      const timeButton = page.locator('#custom-grid .time-body');
      const popover = page.locator('.popover-viewport');
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await expect(timeButton).toHaveScreenshot(screenshot(`datetime-custom-time-button`));

      await timeButton.click();
      await ionPopoverDidPresent.next();

      await expect(popover).toHaveScreenshot(screenshot(`datetime-custom-time-picker`));
      await expect(timeButton).toHaveScreenshot(screenshot(`datetime-custom-time-button-active`));
    });

    test('should allow styling calendar days in grid style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-calendar-days');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-calendar-days`));
    });
  });
});

/**
 * This behavior does not differ across
 * directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: custom focus'), () => {
    test('should focus the selected day and then the day after', async ({ page }) => {
      await page.goto(`/src/components/datetime/test/custom`, config);

      const datetime = page.locator('#custom-calendar-days');

      const day = datetime.locator(`.calendar-day[data-day='15'][data-month='6']`);

      await day.focus();
      await page.waitForChanges();

      await expect(day).toBeFocused();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-focus-selected-calendar-day`));

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();

      const nextDay = datetime.locator(`.calendar-day[data-day='16'][data-month='6']`);

      await expect(nextDay).toBeFocused();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-focus-calendar-day`));
    });
  });
});
