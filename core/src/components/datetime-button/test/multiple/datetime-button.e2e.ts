import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: multiple selection', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'No mode-specific logic');
  });
  test('should render number of dates', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

      <script>
        const datetime = document.querySelector('ion-datetime');
        datetime.value = ['2022-06-01', '2022-06-02', '2022-06-03'];
      </script>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetimeButton = page.locator('ion-datetime-button');
    await expect(datetimeButton).toHaveText('3 days');
  });
  test('should render date when only 1 day is selected', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

      <script>
        const datetime = document.querySelector('ion-datetime');
        datetime.value = ['2022-06-01'];
      </script>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetimeButton = page.locator('ion-datetime-button');
    await expect(datetimeButton).toHaveText('Jun 1, 2022');
  });
  test('should use customFormatter', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

      <script>
        const datetime = document.querySelector('ion-datetime');
        datetime.titleSelectedDatesFormatter = (selectedDates) => {
          return 'Selected: ' + selectedDates.length;
        };
        datetime.value = ['2022-06-01', '2022-06-02', '2022-06-03'];
      </script>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetimeButton = page.locator('ion-datetime-button');
    await expect(datetimeButton).toHaveText('Selected: 3');
  });
  test('should re-render when value is programmatically changed', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

      <script>
        const datetime = document.querySelector('ion-datetime');
        datetime.value = ['2022-06-01', '2022-06-02'];
      </script>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetimeButton = page.locator('ion-datetime-button');
    const datetime = page.locator('ion-datetime');
    await expect(datetimeButton).toHaveText('2 days');

    await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = ['2022-06-01', '2022-06-02', '2022-06-3']));
    await page.waitForChanges();

    await expect(datetimeButton).toHaveText('3 days');
  });
});
