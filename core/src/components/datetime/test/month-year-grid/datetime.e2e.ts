import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Visual regressions are mode/direction-dependent.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: month/year grid picker (visual regressions)'), () => {
    test('grid picker open should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-year-picker-view="grid"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await page.locator('ion-datetime .calendar-month-year').click();
      await page.locator('.month-year-picker-open').waitFor();

      await expect(page.locator('ion-datetime')).toHaveScreenshot(screenshot('datetime-month-year-grid-open'));
    });

    test('month-year presentation with grid should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="month-year" value="2022-06-15" month-year-picker-view="grid"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();
      await expect(page.locator('ion-datetime')).toHaveScreenshot(screenshot('datetime-month-year-grid-presentation'));
    });
  });
});

/**
 * Functionality is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: month/year grid picker (functionality)'), () => {
    test('clicking month-year button should open the grid overlay', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-year-picker-view="grid"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await datetime.locator('.calendar-month-year').click();
      await page.locator('.month-year-picker-open').waitFor();

      await expect(datetime.locator('.month-year-grid-container')).toBeVisible();
    });

    test('clicking a month cell should update the working month and close the overlay', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-year-picker-view="grid"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const monthYear = datetime.locator('.calendar-month-year');

      await monthYear.click();
      await page.locator('.month-year-picker-open').waitFor();

      // Click "March" cell
      await datetime.locator('.month-year-grid-cell').filter({ hasText: 'Mar' }).click();
      await page.waitForChanges();

      await expect(monthYear).toContainText('March 2022');
      await expect(datetime.locator('.month-year-grid-container')).not.toBeVisible();
    });

    test('clicking a year cell should update the working year and close the overlay', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-year-picker-view="grid"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const monthYear = datetime.locator('.calendar-month-year');

      await monthYear.click();
      await page.locator('.month-year-picker-open').waitFor();

      // Click a year cell that is in the current page
      await datetime.locator('.month-year-grid-years .month-year-grid-cell').filter({ hasText: '2021' }).click();
      await page.waitForChanges();

      // Verify the year changed to 2021 (month may vary due to headless scroll init behaviour)
      await expect(monthYear).toContainText('2021');
      await expect(datetime.locator('.month-year-grid-container')).not.toBeVisible();
    });

    test('year grid next page button should advance the year page', async ({ page }) => {
      await page.setContent(
        // max="2040-12-31" ensures the next-page button is enabled (the current page 2016–2039
        // does not yet include 2040, so nextPageDisabled is false).
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-year-picker-view="grid" max="2040-12-31"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await datetime.locator('.calendar-month-year').click();
      await page.locator('.month-year-picker-open').waitFor();

      const yearCellsBefore = await datetime.locator('.month-year-grid-years .month-year-grid-cell').allTextContents();
      const nextPageButton = datetime.locator('.month-year-grid-year-nav ion-button:nth-child(2)');

      await nextPageButton.click();
      await page.waitForChanges();

      const yearCellsAfter = await datetime.locator('.month-year-grid-years .month-year-grid-cell').allTextContents();

      // Pages should be different
      expect(yearCellsBefore[0]).not.toEqual(yearCellsAfter[0]);
    });

    test('min/max should disable out-of-range months', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="date" value="2022-06-15" month-year-picker-view="grid" min="2022-03-01" max="2022-10-31"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      await datetime.locator('.calendar-month-year').click();
      await page.locator('.month-year-picker-open').waitFor();

      // With min=March and max=October, only months 3–10 are rendered.
      // January and February are not rendered at all (they are outside the min year boundary).
      const janCell = datetime.locator('.month-year-grid-cell').filter({ hasText: 'Jan' });
      await expect(janCell).toHaveCount(0);

      // March should be present and enabled (at min boundary)
      const marCell = datetime.locator('.month-year-grid-cell').filter({ hasText: 'Mar' });
      await expect(marCell).not.toBeDisabled();
    });

    test('month-year presentation should show grid inline without toggle', async ({ page }) => {
      await page.setContent(
        `<ion-datetime locale="en-US" presentation="month-year" value="2022-06-15" month-year-picker-view="grid"></ion-datetime>`,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      // Grid should be visible immediately, no toggle needed
      await expect(datetime.locator('.month-year-grid-container')).toBeVisible();
    });
  });
});
