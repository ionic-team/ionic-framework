import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

const DISABLED_CALENDAR_DAY_SELECTOR =
  '.calendar-day[disabled]:not(.calendar-day-padding)';

const queryAllDisabledDays = (
  page: E2EPage,
  datetimeSelector = 'ion-datetime'
) => {
  return page.locator(
    `${datetimeSelector} ${DISABLED_CALENDAR_DAY_SELECTOR}`
  );
};

const queryAllWorkingMonthDisabledDays =
  (
    page: E2EPage,
    datetimeSelector = 'ion-datetime'
  ) => {
    return page.locator(
      `${datetimeSelector} .calendar-month:nth-child(2) ${DISABLED_CALENDAR_DAY_SELECTOR}`
    );
  };

/**
 * This is testing component functionality
 * that does not differ across modes/directions.
 */
configs({
  directions: ['ltr'],
  modes: ['ios'],
}).forEach(({ title, config }) => {
  test.describe(
    title('datetime: disable dates'),
    () => {
      test.describe(
        'check return values',
        () => {
          test.beforeEach(
            async ({ page }) => {
              await page.setContent(
                '<ion-datetime value="2021-10-01"></ion-datetime>',
                config
              );
            }
          );

          test.describe(
            'when isDateEnabled returns true',
            () => {
              test('calendar days should be enabled', async ({
                page,
              }) => {
                const datetime =
                  page.locator(
                    'ion-datetime'
                  );
                await datetime.evaluate(
                  (
                    el: HTMLIonDatetimeElement
                  ) =>
                    (el.isDateEnabled =
                      () => true)
                );
                await page.waitForChanges();

                const disabledDays =
                  queryAllDisabledDays(
                    page
                  );
                expect(
                  await disabledDays.count()
                ).toBe(0);
              });
            }
          );
          test.describe(
            'when isDateEnabled returns false',
            () => {
              test('calendar days should be disabled', async ({
                page,
              }) => {
                const datetime =
                  page.locator(
                    'ion-datetime'
                  );
                await datetime.evaluate(
                  (
                    el: HTMLIonDatetimeElement
                  ) =>
                    (el.isDateEnabled =
                      () => false)
                );
                await page.waitForChanges();

                const disabledDays =
                  queryAllDisabledDays(
                    page
                  );
                expect(
                  await disabledDays.count()
                ).toBe(91);
              });
            }
          );
          test.describe(
            'when isDateEnabled returns undefined',
            () => {
              test('calendar days should be disabled', async ({
                page,
              }) => {
                const datetime =
                  page.locator(
                    'ion-datetime'
                  );
                await datetime.evaluate(
                  (
                    el: HTMLIonDatetimeElement
                  ) => {
                    /**
                     * isDateEnabled expects a boolean, but we need
                     * to check what happens when users pass in unexpected
                     * values which is why we do the ts-ignore.
                     */
                    // @ts-ignore
                    el.isDateEnabled =
                      () => {
                        undefined;
                      };
                  }
                );

                await page.waitForChanges();

                const disabledDays =
                  queryAllDisabledDays(
                    page
                  );
                expect(
                  await disabledDays.count()
                ).toBe(91);
              });
            }
          );
          test.describe(
            'when isDateEnabled returns null',
            () => {
              test('calendar days should be disabled', async ({
                page,
              }) => {
                const datetime =
                  page.locator(
                    'ion-datetime'
                  );
                await datetime.evaluate(
                  (
                    el: HTMLIonDatetimeElement
                  ) => {
                    /**
                     * isDateEnabled expects a boolean, but we need
                     * to check what happens when users pass in unexpected
                     * values which is why we do the ts-ignore.
                     */
                    // @ts-ignore
                    el.isDateEnabled =
                      () => null;
                  }
                );

                await page.waitForChanges();

                const disabledDays =
                  queryAllDisabledDays(
                    page
                  );
                expect(
                  await disabledDays.count()
                ).toBe(91);
              });
            }
          );
          test.describe(
            'when isDateEnabled throws an exception',
            () => {
              test.beforeEach(
                async ({ page }) => {
                  const datetime =
                    page.locator(
                      'ion-datetime'
                    );
                  await datetime.evaluate(
                    (
                      el: HTMLIonDatetimeElement
                    ) => {
                      el.isDateEnabled =
                        (
                          dateIsoString: string
                        ) => {
                          const date =
                            new Date(
                              dateIsoString
                            );

                          if (
                            date.getUTCDate() ===
                              10 &&
                            date.getUTCMonth() ===
                              9 &&
                            date.getUTCFullYear() ===
                              2021
                          ) {
                            // Throws an exception on October 10, 2021
                            // Expected behavior: the day should be enabled
                            throw new Error(
                              'Expected exception for e2e test.'
                            );
                          }
                          return false;
                        };
                    }
                  );
                }
              );
              test('calendar days should be enabled', async ({
                page,
              }) => {
                await page.waitForChanges();

                const enabledDays =
                  page.locator(
                    'ion-datetime .calendar-month:nth-child(2) .calendar-day:not([disabled]):not(.calendar-day-padding)'
                  );

                expect(
                  await enabledDays.count()
                ).toBe(1);
              });
            }
          );
        }
      );
      test.describe(
        'check example usages',
        () => {
          test.beforeEach(
            async ({ page }) => {
              await page.goto(
                '/src/components/datetime/test/disable-dates',
                config
              );
              await page
                .locator(
                  '.datetime-ready'
                )
                .first()
                .waitFor();
            }
          );

          test('should disable a specific date', async ({
            page,
          }) => {
            const disabledDay =
              queryAllDisabledDays(
                page,
                '#specificDate'
              );

            await expect(
              disabledDay
            ).toHaveText('10');
          });

          test('should disable specific days of the week', async ({
            page,
          }) => {
            const disabledDays =
              queryAllWorkingMonthDisabledDays(
                page,
                '#weekends'
              );

            expect(
              await disabledDays.count()
            ).toEqual(10);
            await expect(
              disabledDays
            ).toHaveText([
              '2',
              '3',
              '9',
              '10',
              '16',
              '17',
              '23',
              '24',
              '30',
              '31',
            ]);
          });

          test('should disable a range of dates', async ({
            page,
          }) => {
            const disabledDays =
              queryAllDisabledDays(
                page,
                '#dateRange'
              );

            expect(
              await disabledDays.count()
            ).toEqual(11);
            await expect(
              disabledDays
            ).toHaveText([
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
            ]);
          });

          test('should disable a month', async ({
            page,
          }) => {
            const disabledDays =
              queryAllDisabledDays(
                page,
                '#month'
              );

            expect(
              await disabledDays.count()
            ).toBe(31);
          });
        }
      );
      test.describe(
        'with a min date range',
        () => {
          test('should not enable already disabled dates', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-datetime min="2021-10-15" value="2021-10-16"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = () => true;
          </script>
        `,
              config
            );

            const disabledDays =
              queryAllWorkingMonthDisabledDays(
                page
              );

            expect(
              await disabledDays.count()
            ).toBe(14);
          });
        }
      );
      test.describe(
        'with a max date range',
        () => {
          test('should not enable already disabled dates', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-datetime max="2021-10-15" value="2021-10-16"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = () => true;
          </script>
        `,
              config
            );

            const disabledDays =
              queryAllWorkingMonthDisabledDays(
                page
              );

            expect(
              await disabledDays.count()
            ).toBe(16);
          });
        }
      );
    }
  );
});
