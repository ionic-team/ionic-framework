import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: highlightedDates'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2023-01-01" locale="en-US"></ion-datetime>
      `,
        config
      );
    });

    test('should render highlights correctly when using an array', async ({ page }) => {
      const datetime = page.locator('ion-datetime');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.highlightedDates = [
          {
            date: '2023-01-01', // ensure selected date style overrides highlight
            textColor: '#800080',
            backgroundColor: '#ffc0cb',
            border: '2px solid purple',
          },
          {
            date: '2023-01-02',
            textColor: '#b22222',
            backgroundColor: '#fa8072',
            border: '2px solid purple',
          },
          {
            date: '2023-01-03',
            textColor: '#0000ff',
            backgroundColor: '#add8e6',
            border: '2px solid purple',
          },
        ];
      });

      await page.waitForChanges();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-highlightedDates-array`));
    });

    test('should render highlights correctly when using a callback', async ({ page }) => {
      const datetime = page.locator('ion-datetime');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.highlightedDates = (isoString) => {
          const date = new Date(isoString);
          const utcDay = date.getUTCDate();

          // ensure selected date style overrides highlight
          if (utcDay === 1) {
            return {
              textColor: '#b22222',
              backgroundColor: '#fa8072',
              border: '2px solid purple',
            };
          }

          if (utcDay % 5 === 0) {
            return {
              textColor: '#800080',
              backgroundColor: '#ffc0cb',
              border: '2px solid purple',
            };
          }

          if (utcDay % 3 === 0) {
            return {
              textColor: '#0000ff',
              backgroundColor: '#add8e6',
              border: '2px solid purple',
            };
          }

          return undefined;
        };
      });

      await page.waitForChanges();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-highlightedDates-callback`));
    });

    test('should render highlights correctly when only using only one color property', async ({ page }) => {
      const datetime = page.locator('ion-datetime');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => {
        el.highlightedDates = [
          {
            date: '2023-01-02',
            backgroundColor: '#fa8072',
          },
          {
            date: '2023-01-03',
            textColor: '#0000ff',
          },
          {
            date: '2023-01-04',
            border: '2px solid purple',
          },
        ];
      });

      await page.waitForChanges();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-highlightedDates-single-color`));
    });
  });
});
