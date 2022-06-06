import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: display', () => {
  test.describe('datetime: rendering', () => {
    test('fixed size should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/display');

      const select = page.locator('select#presentation');
      const datetime = page.locator('ion-datetime');

      select.selectOption('date-time');
      await page.waitForChanges();

      expect(await datetime.screenshot()).toMatchSnapshot(
        `datetime-display-date-time-${page.getSnapshotSettings()}.png`
      );

      select.selectOption('time-date');
      await page.waitForChanges();

      expect(await datetime.screenshot()).toMatchSnapshot(
        `datetime-display-time-date-${page.getSnapshotSettings()}.png`
      );

      select.selectOption('time');
      await page.waitForChanges();

      expect(await datetime.screenshot()).toMatchSnapshot(`datetime-display-time-${page.getSnapshotSettings()}.png`);

      select.selectOption('date');
      await page.waitForChanges();

      expect(await datetime.screenshot()).toMatchSnapshot(`datetime-display-date-${page.getSnapshotSettings()}.png`);
    });

    test('cover size should not have visual regressions', async ({ page }) => {
      /**
       * We need to take a screenshot of the entire page
       * here as we want to test that the datetime fills
       * the entire screen.
       */
      await page.setViewportSize({ width: 500, height: 500 });
      await page.goto('/src/components/datetime/test/display');
      await page.waitForSelector('.datetime-ready');
      const changeEvent = await page.spyOnEvent('change');

      const select = page.locator('select#presentation');
      const sizeSelect = page.locator('select#size');

      sizeSelect.selectOption('cover');
      await changeEvent.next();

      select.selectOption('date-time');
      await changeEvent.next();

      await page.waitForChanges();

      expect(await page.screenshot()).toMatchSnapshot(
        `datetime-display-cover-date-time-${page.getSnapshotSettings()}.png`
      );

      select.selectOption('time-date');
      await changeEvent.next();
      await page.waitForChanges();

      expect(await page.screenshot()).toMatchSnapshot(
        `datetime-display-cover-time-date-${page.getSnapshotSettings()}.png`
      );

      select.selectOption('time');
      await changeEvent.next();
      await page.waitForChanges();

      expect(await page.screenshot()).toMatchSnapshot(`datetime-display-cover-time-${page.getSnapshotSettings()}.png`);

      select.selectOption('date');
      await changeEvent.next();
      await page.waitForChanges();

      expect(await page.screenshot()).toMatchSnapshot(`datetime-display-cover-date-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('datetime: switch presentations', () => {
    test('month selection should work after changing presentation', async ({ page, browserName }) => {
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

      expect(calendarMonthYear).toHaveText('March 2022');

      // ensure it still works if presentation is changed more than once
      await select.selectOption('date-time');
      await page.waitForChanges();

      const prevMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button:first-child');
      await prevMonthButton.click();
      await page.waitForChanges();

      await ionWorkingPartsDidChange.next();

      expect(calendarMonthYear).toHaveText('February 2022');
    });
  });
});
