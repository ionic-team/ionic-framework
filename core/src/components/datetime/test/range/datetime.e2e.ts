import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Visual regressions are mode/direction-dependent.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: range selection (visual regressions)'), () => {
    test('committed range should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.value = ['2022-06-10', '2022-06-20'];
      });
      await page.waitForChanges();

      await expect(datetime).toHaveScreenshot(screenshot('datetime-range-committed'));
    });

    test('partial range (start only) should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      // Click a start date to produce a partial range
      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await page.waitForChanges();

      await expect(datetime).toHaveScreenshot(screenshot('datetime-range-partial'));
    });
  });
});

/**
 * Functionality is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: range selection (functionality)'), () => {
    test('first click should set the start date without emitting ionChange', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await page.waitForChanges();

      // ionChange must NOT fire for a partial range
      expect(ionChangeSpy).not.toHaveReceivedEvent();
    });

    test('second click should commit the range and emit ionChange', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await page.waitForChanges();

      await datetime.locator('[data-month="6"][data-day="20"]').click();
      await ionChangeSpy.next();

      await expect(datetime).toHaveJSProperty('value', ['2022-06-10', '2022-06-20']);
    });

    test('clicking end before start should swap so start is always earlier', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      // Click end date first, then start date
      await datetime.locator('[data-month="6"][data-day="20"]').click();
      await page.waitForChanges();

      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await ionChangeSpy.next();

      // Should be normalised: earlier date is always start
      await expect(datetime).toHaveJSProperty('value', ['2022-06-10', '2022-06-20']);
    });

    test('clicking after a complete range should start a new range', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      // First range
      await datetime.locator('[data-month="6"][data-day="5"]').click();
      await page.waitForChanges();
      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await ionChangeSpy.next();

      // Third click — starts a fresh range, no ionChange yet
      await datetime.locator('[data-month="6"][data-day="15"]').click();
      await page.waitForChanges();
      expect(ionChangeSpy).toHaveReceivedEventTimes(1);
    });

    test('setting value programmatically should display the range', async ({ page }) => {
      await page.setContent(
        // Provide an initial value in June 2022 so no animation fires when we set
        // the range programmatically (changing month would otherwise cause a
        // scroll-snap animation and a second June month in the DOM).
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.value = ['2022-06-10', '2022-06-20'];
      });
      await page.waitForChanges();

      await expect(datetime).toHaveJSProperty('value', ['2022-06-10', '2022-06-20']);

      // Start and end cells should have the correct classes
      await expect(datetime.locator('[data-month="6"][data-day="10"]').locator('..')).toHaveClass(
        /calendar-day-wrapper-range-start/
      );
      await expect(datetime.locator('[data-month="6"][data-day="20"]').locator('..')).toHaveClass(
        /calendar-day-wrapper-range-end/
      );
    });

    test('days between start and end should have in-range class', async ({ page }) => {
      await page.setContent(
        // Provide an initial value in June 2022 so no animation fires when we set
        // the range programmatically.
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.value = ['2022-06-10', '2022-06-20'];
      });
      await page.waitForChanges();

      await expect(datetime.locator('[data-month="6"][data-day="15"]').locator('..')).toHaveClass(
        /calendar-day-wrapper-in-range/
      );
    });

    test('with buttons: value should not update until confirm is called', async ({ page }) => {
      await page.setContent(
        // Provide an initial value in June 2022 so day clicks land on June 2022 dates.
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range" show-default-buttons="true"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await page.waitForChanges();
      await datetime.locator('[data-month="6"][data-day="20"]').click();
      await page.waitForChanges();

      // Value should not have changed yet (buttons mode — confirm required)
      await expect(datetime).toHaveJSProperty('value', '2022-06-01');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());
      await expect(datetime).toHaveJSProperty('value', ['2022-06-10', '2022-06-20']);
    });

    test('ionChange event detail should contain the range value', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-01" selection-mode="range"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await datetime.locator('[data-month="6"][data-day="10"]').click();
      await page.waitForChanges();
      await datetime.locator('[data-month="6"][data-day="20"]').click();
      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEventDetail({ value: ['2022-06-10', '2022-06-20'] });
    });
  });
});
