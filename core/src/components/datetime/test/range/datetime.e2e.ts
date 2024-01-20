import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: range'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" range="true"></ion-datetime>
        <script>
          const datetime = document.querySelector('ion-datetime');
          datetime.value = {
            start: '2023-01-09',
            end:'2023-01-16'
          };
        </script>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');

      await expect(datetime).toHaveScreenshot(screenshot('datetime-range'));
    });
  });
});

configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: range: styling api'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
      <style>
        ion-datetime {
          --range-background: rgb(235, 68, 90, 0.1);
        }
        ion-datetime::part(range-start),
        ion-datetime::part(range-end) {
          background: rgb(235, 68, 90);
        }
        ion-datetime::part(range-start) {
          border-radius: 32px 0 0 32px;
        }
        ion-datetime::part(range-end) {
          border-radius: 0 32px 32px 0;
        }
        ion-datetime::part(range-start range-end) {
          border-radius: 50%;
        }
      </style>
      <ion-datetime presentation="date" range="true"></ion-datetime>
      <script>
        const datetime = document.querySelector('ion-datetime');
        datetime.value = {
          start: '2023-01-09',
          end:'2023-01-16'
        };
      </script>
    `,
        config
      );

      const datetime = page.locator('ion-datetime');

      await expect(datetime).toHaveScreenshot(screenshot('datetime-range-styling-api'));
    });
  });
});
