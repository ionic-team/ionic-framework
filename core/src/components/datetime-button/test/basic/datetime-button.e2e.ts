import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: switching to correct view', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');

    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');
  });
  test('should switch to a date-only view when the date button is clicked', async ({ page }) => {
    const datetime = page.locator('ion-datetime');
    expect(datetime).toHaveJSProperty('presentation', 'date-time');

    await page.locator('#date-button').click();

    expect(datetime).toHaveJSProperty('presentation', 'date');
  });
  test('should switch to a time-only view when the time button is clicked', async ({ page }) => {
    const datetime = page.locator('ion-datetime');
    expect(datetime).toHaveJSProperty('presentation', 'date-time');

    await page.locator('#time-button').click();

    expect(datetime).toHaveJSProperty('presentation', 'time');
  });
});

test.describe('datetime-button: labels', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');
  });
  test('should set date and time labels in separate buttons', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toContainText('Jan 1, 2022');
    await expect(page.locator('#time-button')).toContainText('6:30 AM');
  });
  test('should set only month and year', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="month-year"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toContainText('January 2022');
    await expect(page.locator('#time-button')).toBeHidden();
  });
  test('should set only year', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="year"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toContainText('2022');
    await expect(page.locator('#time-button')).toBeHidden();
  });
  test('should set only month', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="month"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toContainText('January');
    await expect(page.locator('#time-button')).toBeHidden();
  });
  test('should set only time', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#time-button')).toContainText('6:30 AM');
    await expect(page.locator('#date-button')).toBeHidden();
  });
  test('should update the label when the value of the datetime changes', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetime = page.locator('ion-datetime');
    const dateTarget = page.locator('#date-button');

    await expect(dateTarget).toContainText('Jan 1, 2022');

    await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2023-05-10'));
    await page.waitForChanges();

    await expect(dateTarget).toContainText('May 10, 2023');
  });
});

test.describe('datetime-button: locale', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');
  });
  test('should use the same locale as datetime', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="es-ES" id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    /**
     * The entire text reads 1 ene 2022, but some browsers will add
     * a period after "ene". Just checking ene allows us to verify the
     * behavior while avoiding these cross browser differences.
     */
    await expect(page.locator('#date-button')).toContainText(/ene/);
    await expect(page.locator('#time-button')).toContainText('6:30');
  });
  test('should respect hour cycle even if different from locale default', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime hour-cycle="h23" locale="en-US" id="datetime" value="2022-01-01T16:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#time-button')).toContainText('16:30');
  });
  test('should ignore the timezone when selecting a date', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" value="2022-01-02T06:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const timeTarget = page.locator('#time-button');
    await expect(timeTarget).toContainText('6:30');

    const firstOfMonth = page.locator('ion-datetime .calendar-day[data-month="1"][data-day="1"]');
    await firstOfMonth.click();
    await page.waitForChanges();

    await expect(timeTarget).toContainText('6:30');
  });
});

test.describe('datetime-button: wheel', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');
  });
  test('should only show a single date button when presentation="date-time" and prefer-wheel="true"', async ({
    page,
  }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" value="2022-01-01T06:30:00" presentation="date-time" prefer-wheel="true"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toContainText('Jan 1, 2022 6:30 AM');
    await expect(page.locator('#time-button')).not.toBeVisible();
  });
  test('should only show a single date button when presentation="time-date" and prefer-wheel="true"', async ({
    page,
  }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" value="2022-01-01T06:30:00" presentation="time-date" prefer-wheel="true"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toContainText('Jan 1, 2022 6:30 AM');
    await expect(page.locator('#time-button')).not.toBeVisible();
  });
});
