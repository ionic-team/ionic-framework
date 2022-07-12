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
  })
  test('should switch to a date-only view when the date button is clicked', async ({ page }) => {
    const datetime = page.locator('ion-datetime');
    expect(datetime).toHaveJSProperty('presentation', 'date-time');

    await page.locator('.date-target-container').click();

    expect(datetime).toHaveJSProperty('presentation', 'date');
  })
  test('should switch to a time-only view when the time button is clicked', async ({ page }) => {
    const datetime = page.locator('ion-datetime');
    expect(datetime).toHaveJSProperty('presentation', 'date-time');

    await page.locator('.time-target-container').click();

    expect(datetime).toHaveJSProperty('presentation', 'time');
  })
});

test.describe('datetime-button: labels', () => {
  test.beforeEach(({ page: _page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');
  });
  test('should set date and time labels in separate buttons', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.date-target-container')).toContainText('Jan 1, 2022');
    expect(await page.locator('.time-target-container')).toContainText('6:30 AM');
  });
  test('should set only month and year', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="month-year"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.date-target-container')).toContainText('January 2022');
  });
  test('should set only year', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="year"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.date-target-container')).toContainText('2022');
  });
  test('should set only month', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="month"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.date-target-container')).toContainText('January');
  });
  test('should set only time', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
      <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.time-target-container')).toContainText('6:30 AM');
  });
})

test.describe('datetime-button: locale', () => {
  test.beforeEach(({ page: _page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');
  });
  test('should use the same locale as datetime', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="es-ES" id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.date-target-container')).toContainText('1 ene 2022');
    expect(await page.locator('.time-target-container')).toContainText('6:30');
  });
  test('should respect hour cycle even if different from locale default', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime hour-cycle="h23" locale="en-US" id="datetime" value="2022-01-01T16:30:00" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    expect(await page.locator('.time-target-container')).toContainText('16:30');
  });
})
