import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: display', () => {
  test.describe('datetime: rendering', () => {
    test.describe('fixed sizes', () => {
      test('date-time should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime value="2022-02-22T16:30:00" presentation="date-time"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-date-time-${page.getSnapshotSettings()}.png`);
      });
      test('time-date should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime value="2022-02-22T16:30:00" presentation="time-date"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-time-date-${page.getSnapshotSettings()}.png`);
      });
      test('time should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime value="2022-02-22T16:30:00" presentation="time"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-time-${page.getSnapshotSettings()}.png`);
      });
      test('date should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime value="2022-02-22T16:30:00" presentation="date"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-date-${page.getSnapshotSettings()}.png`);
      });
    });
    test.describe('cover sizes', () => {
      test.beforeEach(async ({ page }) => {
        /**
         * We need to take a screenshot of the entire page
         * here as we want to test that the datetime fills
         * the entire screen.
         */
        await page.setViewportSize({ width: 500, height: 500 });
      });
      test('date-time should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="date-time"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-cover-date-time-${page.getSnapshotSettings()}.png`);
      });
      test('time-date should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="time-date"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-cover-time-date-${page.getSnapshotSettings()}.png`);
      });
      test('time should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="time"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-cover-time-${page.getSnapshotSettings()}.png`);
      });
      test('date should not have any visual regressions', async ({ page }) => {
        await page.setContent(`
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="date"></ion-datetime>
        `);
        const datetime = page.locator('ion-datetime');
        await expect(datetime).toHaveScreenshot(`datetime-display-cover-date-${page.getSnapshotSettings()}.png`);
      });
    });
  });
  test.describe('datetime: switch presentations', () => {
    test('month selection should work after changing presentation', async ({ page }) => {
      await page.goto('/src/components/datetime/test/display');
      const ionWorkingPartsDidChange = await page.spyOnEvent('ionWorkingPartsDidChange');
      await page.waitForSelector('.datetime-ready');

      const select = page.locator('select#presentation');

      await select.selectOption('date-time');
      await page.waitForChanges();

      await select.selectOption('time-date');
      await page.waitForChanges();

      const nextMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button + ion-button');
      await nextMonthButton.click();
      await page.waitForChanges();

      await ionWorkingPartsDidChange.next();

      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');

      await expect(calendarMonthYear).toHaveText(/March 2022/);

      // ensure it still works if presentation is changed more than once
      await select.selectOption('date-time');
      await page.waitForChanges();

      const prevMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button:first-child');
      await prevMonthButton.click();
      await page.waitForChanges();

      await ionWorkingPartsDidChange.next();

      await expect(calendarMonthYear).toHaveText(/February 2022/);
    });
  });
});
