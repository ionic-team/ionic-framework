import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 * since it is texting fixed vs fluid widths.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('datetime: rendering'),
      () => {
        test.describe(
          'fixed sizes',
          () => {
            test('date-time should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime value="2022-02-22T16:30:00" presentation="date-time"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-date-time`
                )
              );
            });
            test('time-date should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime value="2022-02-22T16:30:00" presentation="time-date"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-time-date`
                )
              );
            });
            test('time should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime value="2022-02-22T16:30:00" presentation="time"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-time`
                )
              );
            });
            test('date should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime value="2022-02-22T16:30:00" presentation="date"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-date`
                )
              );
            });
          }
        );
        test.describe(
          'cover sizes',
          () => {
            test.beforeEach(
              async ({ page }) => {
                /**
                 * We need to take a screenshot of the entire page
                 * here as we want to test that the datetime fills
                 * the entire screen.
                 */
                await page.setViewportSize(
                  {
                    width: 500,
                    height: 500,
                  }
                );
              }
            );
            test('date-time should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="date-time"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-cover-date-time`
                )
              );
            });
            test('time-date should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="time-date"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-cover-time-date`
                )
              );
            });
            test('time should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="time"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-cover-time`
                )
              );
            });
            test('date should not have any visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-datetime size="cover" value="2022-02-22T16:30:00" presentation="date"></ion-datetime>
        `,
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .waitFor();
              const datetime =
                page.locator(
                  'ion-datetime'
                );
              await expect(
                datetime
              ).toHaveScreenshot(
                screenshot(
                  `datetime-display-cover-date`
                )
              );
            });
          }
        );
      }
    );
  }
);

/**
 * This is testing functionality
 * and does not vary across modes/directions.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title(
      'datetime: switch presentations'
    ),
    () => {
      test('month selection should work after changing presentation', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/datetime/test/display',
          config
        );
        const ionWorkingPartsDidChange =
          await page.spyOnEvent(
            'ionWorkingPartsDidChange'
          );
        await page
          .locator('.datetime-ready')
          .waitFor();

        const select = page.locator(
          'select#presentation'
        );

        await select.selectOption(
          'date-time'
        );
        await page.waitForChanges();

        await select.selectOption(
          'time-date'
        );
        await page.waitForChanges();

        const nextMonthButton =
          page.locator(
            'ion-datetime .calendar-next-prev ion-button + ion-button'
          );
        await nextMonthButton.click();
        await page.waitForChanges();

        await ionWorkingPartsDidChange.next();

        const calendarMonthYear =
          page.locator(
            'ion-datetime .calendar-month-year'
          );

        await expect(
          calendarMonthYear
        ).toHaveText(/March 2022/);

        // ensure it still works if presentation is changed more than once
        await select.selectOption(
          'date-time'
        );
        await page.waitForChanges();

        const prevMonthButton =
          page.locator(
            'ion-datetime .calendar-next-prev ion-button:first-child'
          );
        await prevMonthButton.click();
        await page.waitForChanges();

        await ionWorkingPartsDidChange.next();

        await expect(
          calendarMonthYear
        ).toHaveText(/February 2022/);
      });
    }
  );
});
