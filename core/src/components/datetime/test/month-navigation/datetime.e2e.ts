import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Visual regressions are mode/direction-dependent.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: month navigation (visual regressions)'), () => {
    test('arrows mode should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="arrows"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();
      await expect(page.locator('ion-datetime')).toHaveScreenshot(screenshot('datetime-month-navigation-arrows'));
    });

    test('scroll mode should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="scroll"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();
      await expect(page.locator('ion-datetime')).toHaveScreenshot(screenshot('datetime-month-navigation-scroll'));
    });
  });
});

/**
 * Functionality is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: month navigation (functionality)'), () => {
    test('arrows mode: next button should advance the month', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="arrows"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const monthYear = datetime.locator('.calendar-month-year');
      const nextButton = datetime.locator('.calendar-next-prev ion-button:nth-child(2)');

      await expect(monthYear).toContainText('June 2022');
      await nextButton.click();
      await page.waitForChanges();
      await expect(monthYear).toContainText('July 2022');
    });

    test('arrows mode: prev button should go back a month', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="arrows"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const monthYear = datetime.locator('.calendar-month-year');
      const prevButton = datetime.locator('.calendar-next-prev ion-button:nth-child(1)');

      await expect(monthYear).toContainText('June 2022');
      await prevButton.click();
      await page.waitForChanges();
      await expect(monthYear).toContainText('May 2022');
    });

    test('scroll mode: per-month headings should be rendered', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="scroll"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const headings = page.locator('ion-datetime .calendar-month-scroll-heading');
      // The ±6 window centres on the working month — verify June 2022 is somewhere in the DOM
      await expect(headings.filter({ hasText: 'June 2022' }).first()).toBeVisible();
    });

    test('scroll mode: aria-live region should be present for screen readers', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="scroll"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      // Scroll mode renders a minimal header with only an aria-live region (no arrow buttons).
      const announceRegion = datetime.locator('.calendar-month-year-announce');
      await expect(announceRegion).toBeAttached();
    });

    test('scroll mode: clicking a day should select it and emit ionChange', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="scroll"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      await datetime.locator('[data-month="6"][data-day="20"]').first().click();
      await ionChangeSpy.next();

      await expect(datetime).toHaveJSProperty('value', '2022-06-20');
    });

    test('scroll mode: min/max should clamp the rendered month window', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-navigation="scroll" min="2022-04-01" max="2022-09-30"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const headings = page.locator('ion-datetime .calendar-month-scroll-heading');
      const texts = await headings.allTextContents();

      // First heading should be April (min), last should be September (max)
      expect(texts[0]).toContain('April 2022');
      expect(texts[texts.length - 1]).toContain('September 2022');
    });
  });
});
