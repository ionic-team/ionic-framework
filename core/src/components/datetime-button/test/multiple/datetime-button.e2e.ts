import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The tested behavior does not
 * vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime-button: multiple selection'), () => {
    test('should render number of dates when more than 1 date is selected', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-01', '2022-06-02', '2022-06-03'];
        </script>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toContainText('3 days');
    });
    test('should render number of dates when 0 dates are selected', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toHaveText('0 days');
    });
    test('should render date when only 1 day is selected', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-01'];
        </script>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toHaveText('Jun 1, 2022');
    });
    test('should use customFormatter', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.titleSelectedDatesFormatter = (selectedDates) => {
            return 'Selected: ' + selectedDates.length;
          };
          datetime.value = ['2022-06-01', '2022-06-02', '2022-06-03'];
        </script>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toHaveText('Selected: 3');
    });
    test('should re-render when value is programmatically changed', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" presentation="date" multiple="true"></ion-datetime>

        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-01', '2022-06-02'];
        </script>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const ionValueChange = await page.spyOnEvent('ionValueChange');
      const dateButton = page.locator('#date-button');
      await expect(dateButton).toHaveText('2 days');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = ['2022-06-01', '2022-06-02', '2022-06-03']));
      await ionValueChange.next();

      await expect(dateButton).toHaveText('3 days');
    });
    test('should render single date if datetime is used incorrectly', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-datetime locale="en-US" id="datetime" presentation="date-time" multiple="true"></ion-datetime>

        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = ['2022-06-01T16:30', '2022-06-02'];
        </script>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toHaveText('Jun 1, 2022');
      await expect(page.locator('#time-button')).toHaveText('4:30 PM');
    });
  });
});
