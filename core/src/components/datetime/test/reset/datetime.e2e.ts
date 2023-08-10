import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.only(title('datetime: reset method'), () => {
    test('should reset the internal state of datetime to the set value', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2023-06-06T16:30" show-default-buttons="true"></ion-datetime>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');

      const dayOne = datetime.locator('.calendar-day[data-month="6"][data-day="1"][data-year="2023"]');
      const daySix = datetime.locator('.calendar-day[data-month="6"][data-day="6"][data-year="2023"]');
      await dayOne.click();
      await page.waitForChanges();

      await expect(dayOne).toHaveClass(/calendar-day-active/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.reset());
      await page.waitForChanges();

      await expect(daySix).toHaveClass(/calendar-day-active/);
    });

    test('should reset the internal state of datetime to the provided value', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime show-default-buttons="true"></ion-datetime>

        <script>
          const mockToday = '2023-06-12T16:22';
          Date = class extends Date {
            constructor(...args) {
              if (args.length === 0) {
                super(mockToday)
              } else {
                super(...args);
              }
            }
          }
        </script>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');

      const dayOne = datetime.locator('.calendar-day[data-month="6"][data-day="1"][data-year="2023"]');
      const daySix = datetime.locator('.calendar-day[data-month="6"][data-day="6"][data-year="2023"]');
      await dayOne.click();
      await page.waitForChanges();

      await expect(dayOne).toHaveClass(/calendar-day-active/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.reset('2023-06-06T16:30'));
      await page.waitForChanges();

      await expect(daySix).toHaveClass(/calendar-day-active/);
    });

    test('should reset the internal state of datetime to today when value is set or passed', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime show-default-buttons="true"></ion-datetime>

        <script>
          const mockToday = '2023-06-06T16:22';
          Date = class extends Date {
            constructor(...args) {
              if (args.length === 0) {
                super(mockToday)
              } else {
                super(...args);
              }
            }
          }
        </script>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');

      const dayOne = datetime.locator('.calendar-day[data-month="6"][data-day="1"][data-year="2023"]');
      await dayOne.click();
      await page.waitForChanges();

      await expect(dayOne).toHaveClass(/calendar-day-active/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.reset());
      await page.waitForChanges();

      await expect(await datetime.locator('.calendar-day-active').count()).toBe(0);
    });
  });
});
