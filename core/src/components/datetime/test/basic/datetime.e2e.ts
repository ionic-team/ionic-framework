import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: closing time popover'), () => {
    test('it should not change months', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25438',
      });

      await page.setContent(
        `
        <ion-datetime></ion-datetime>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      const timeButton = page.locator('.time-body');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      const currentMonthAndYear = await calendarMonthYear.evaluate((el: HTMLElement) => el.innerText);

      await timeButton.click();
      await ionPopoverDidPresent.next();

      await page.keyboard.press('Escape');

      await ionPopoverDidDismiss.next();
      await page.waitForChanges();

      await expect(calendarMonthYear).toHaveText(currentMonthAndYear, { useInnerText: true });
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: selecting a day'), () => {
    const testHighlight = async (page: E2EPage, datetimeID: string) => {
      const today = new Date();
      await page.goto('/src/components/datetime/test/basic', config);
      await page.setIonViewport();

      const todayBtn = page.locator(
        `#${datetimeID} .calendar-day[data-day='${today.getDate()}'][data-month='${today.getMonth() + 1}']`
      );

      await expect(todayBtn).toHaveClass(/calendar-day-today/);
      await expect(todayBtn).not.toHaveClass(/calendar-day-active/);

      await todayBtn.click();
      await page.waitForChanges();

      await expect(todayBtn).toHaveClass(/calendar-day-active/);
    };

    test('should not highlight a day until one is selected', async ({ page }) => {
      await testHighlight(page, 'inline-datetime-no-value');
    });

    test('should not highlight a day until one is selected, with default-buttons', async ({ page }) => {
      await testHighlight(page, 'custom-datetime');
    });
    test('should update the active day', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime show-default-buttons="true" value="2021-12-25T12:40:00.000Z"></ion-datetime>
      `,
        config
      );

      const activeDay = page.locator('ion-datetime .calendar-day-active');

      await expect(activeDay).toHaveText('25');

      const dayBtn = page.locator('ion-datetime .calendar-day[data-day="13"][data-month="12"]');
      await dayBtn.click();
      await page.waitForChanges();

      await expect(activeDay).toHaveText('13');
    });
    test('should set both date and time when no value is initially set', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="date-time"></ion-datetime>

        <script>
          const mockToday = '2022-10-10T16:22';
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

      await page.waitForSelector('.datetime-ready');
      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');

      // Oct 1, 2022
      await page.click('.calendar-day[data-month="10"][data-year="2022"][data-day="1"]');

      await ionChange.next();

      await expect(datetime).toHaveJSProperty('value', '2022-10-01T16:22:00');
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: confirm date'), () => {
    test('should not update value if Done was clicked without selecting a day first', async ({ page }) => {
      await page.goto('/src/components/datetime/test/basic', config);

      const datetime = page.locator('#custom-datetime');

      const value = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
      expect(value).toBeUndefined();

      await datetime.evaluate(async (el: HTMLIonDatetimeElement) => {
        await el.confirm();
      });
      const valueAgain = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
      expect(valueAgain).toBeUndefined();
    });
    test('should set the date value based on the selected date', async ({ page }) => {
      await page.setContent(
        `
        <button id="bind">Bind datetimeMonthDidChange event</button>
        <ion-datetime value="2021-12-25T12:40:00.000Z"></ion-datetime>
        <script type="module">
          import { InitMonthDidChangeEvent } from '/src/components/datetime/test/utils/month-did-change-event.js';
          document.querySelector('button').addEventListener('click', function() {
            InitMonthDidChangeEvent();
          });
        </script>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');
      const eventButton = page.locator('button#bind');
      await eventButton.click();

      const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');
      await buttons.nth(1).click();

      await datetimeMonthDidChange.next();

      const datetime = page.locator('ion-datetime');
      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());

      await ionChange.next();

      await expect(datetime).toHaveJSProperty('value', '2021-12-25T12:40:00');
    });
  });
});

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: footer'), () => {
    test('should render default buttons', async ({ page }) => {
      await page.setContent('<ion-datetime value="2022-05-03" show-default-buttons="true"></ion-datetime>', config);

      const cancelButton = page.locator('ion-datetime #cancel-button');
      await expect(cancelButton).toHaveText('Cancel');

      const confirmButton = page.locator('ion-datetime #confirm-button');
      await expect(confirmButton).toHaveText('Done');

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-footer-default-buttons`));
    });
    test('should render clear button', async ({ page }) => {
      await page.setContent('<ion-datetime value="2022-05-03" show-clear-button="true"></ion-datetime>', config);

      const clearButton = page.locator('ion-datetime #clear-button');
      await expect(clearButton).toHaveText('Clear');

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-footer-clear-button`));
    });
    test('should render default and clear buttons', async ({ page }) => {
      await page.setContent(
        '<ion-datetime value="2022-05-03" show-default-buttons="true" show-clear-button="true"></ion-datetime>',
        config
      );

      const cancelButton = page.locator('ion-datetime #cancel-button');
      await expect(cancelButton).toHaveText('Cancel');

      const confirmButton = page.locator('ion-datetime #confirm-button');
      await expect(confirmButton).toHaveText('Done');

      const clearButton = page.locator('ion-datetime #clear-button');
      await expect(clearButton).toHaveText('Clear');

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-footer-default-clear-buttons`));
    });
    test('should render custom buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-05-03">
          <ion-buttons slot="buttons">
            <ion-button id="custom-button" color="primary">Hello!</ion-button>
          </ion-buttons>
        </ion-datetime>
      `,
        config
      );

      const customButton = page.locator('ion-datetime #custom-button');
      await expect(customButton).toBeVisible();

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-footer-custom-buttons`));
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: swiping'), () => {
    test('should move to prev month by swiping', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-05-03"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const calendarBody = page.locator('ion-datetime .calendar-body');
      const calendarHeader = page.locator('ion-datetime .calendar-month-year');

      await expect(calendarHeader).toHaveText(/May 2022/);

      await calendarBody.evaluate((el: HTMLElement) => (el.scrollLeft = 0));
      await page.waitForChanges();

      await expect(calendarHeader).toHaveText(/April 2022/);
    });
    test('should move to next month by swiping', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-05-03"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const calendarBody = page.locator('ion-datetime .calendar-body');
      const calendarHeader = page.locator('ion-datetime .calendar-month-year');

      await expect(calendarHeader).toHaveText(/May 2022/);

      await calendarBody.evaluate((el: HTMLElement) => (el.scrollLeft = el.scrollWidth));
      await page.waitForChanges();

      await expect(calendarHeader).toHaveText(/June 2022/);
    });
    test('should not re-render if swipe is in progress', async ({ page, skip }) => {
      skip.browser('webkit', 'Wheel is not available in WebKit');

      await page.setContent(
        `
        <ion-datetime value="2022-05-03"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const calendarBody = page.locator('ion-datetime .calendar-body');
      const calendarHeader = page.locator('ion-datetime .calendar-month-year');

      await expect(calendarHeader).toHaveText(/May 2022/);

      const box = await calendarBody.boundingBox();

      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.wheel(-50, 0);
        await page.waitForChanges();

        await expect(calendarHeader).toHaveText(/May 2022/);
      }
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: visibility'), () => {
    test('should reset month/year interface when hiding datetime', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const monthYearButton = page.locator('ion-datetime .calendar-month-year');
      const monthYearInterface = page.locator('ion-datetime .datetime-year');
      const datetime = page.locator('ion-datetime');

      await monthYearButton.click();
      await page.waitForChanges();

      await expect(monthYearInterface).toBeVisible();

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.style.setProperty('display', 'none'));
      await expect(datetime).toBeHidden();
      await expect(datetime).not.toHaveClass(/datetime-ready/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.style.removeProperty('display'));
      await expect(datetime).toBeVisible();

      await page.waitForSelector('.datetime-ready');

      // month/year interface should be reset
      await expect(monthYearInterface).toBeHidden();
    });
  });
});

/**
 * We are setting RTL on the component
 * instead, so we don't need to test
 * both directions. Also, this behavior
 * does not vary across modes.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: RTL set on component'), () => {
    test('should flip icons when RTL is set on component directly', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime dir="rtl"></ion-datetime>
      `,
        config
      );

      const nextPrevIcons = page.locator('ion-datetime .calendar-next-prev ion-icon');
      await expect(nextPrevIcons.first()).toHaveClass(/flip-rtl/);
      await expect(nextPrevIcons.last()).toHaveClass(/flip-rtl/);
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: clear button'), () => {
    test('should clear the active calendar day', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26258',
      });

      await page.setContent(
        `
        <ion-datetime value="2022-11-10" show-clear-button="true"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const selectedDay = page.locator('ion-datetime .calendar-day-active');

      await expect(selectedDay).toHaveText('10');

      await page.click('ion-datetime #clear-button');

      await page.waitForChanges();

      await expect(selectedDay).toHaveCount(0);
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: ionChange'), () => {
    test('should fire ionChange when confirming a value from the calendar grid', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" value="2022-01-02"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const ionChange = await page.spyOnEvent('ionChange');
      const calendarButtons = page.locator('.calendar-day:not([disabled])');

      await calendarButtons.nth(0).click();

      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventTimes(1);
    });

    test('should not fire ionChange when programmatically setting a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" value="2022-01-02"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const ionChange = await page.spyOnEvent('ionChange');
      const datetime = page.locator('ion-datetime');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2022-01-01'));
      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: today button rendering'), () => {
    test('should render today button correctly when selected', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'FW-5808',
      });
      await page.setContent(
        `
        <ion-datetime presentation="date" value="2022-01-02"></ion-datetime>

        <script>
          const mockToday = '2022-01-02T16:22';
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

      await page.waitForSelector('.datetime-ready');

      await expect(datetime.locator('.calendar-day-today')).toHaveScreenshot(
        screenshot(`datetime-today-calendar-button`)
      );
    });
  });
});

/**
 * The calendar day highlight does not render
 * on iOS and has the same behavior across directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: MD highlight rendering'), () => {
    test('datetime: md highlight should not clip at start or end of month', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/24891',
      });

      await page.setContent(
        `
        <ion-datetime value="2021-01-01"></ion-datetime>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');

      await page.waitForSelector('.datetime-ready');

      await expect(datetime).toHaveScreenshot(screenshot(`date-highlight-start-of-month`));

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-01-31'));
      await page.waitForChanges();

      await expect(datetime).toHaveScreenshot(screenshot(`date-highlight-end-of-month`));
    });
  });
});

/**
 * This behavior does not differ across
 * directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: focus'), () => {
    test('should focus the selected day and then the day after', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2023-08-01"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const datetime = page.locator('ion-datetime');

      const day = datetime.locator(`.calendar-day[data-day='1'][data-month='8']`);

      await day.focus();
      await page.waitForChanges();

      await expect(day).toBeFocused();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-focus-selected-calendar-day`));

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();

      const nextDay = datetime.locator(`.calendar-day[data-day='2'][data-month='8']`);

      await expect(nextDay).toBeFocused();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-focus-calendar-day`));
    });
  });
});
