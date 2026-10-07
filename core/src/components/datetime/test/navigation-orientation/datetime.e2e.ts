import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The month whose block starts at the top of the list, as "year-month". It is
 * what the user sees first, so it is what scrolling and re-centering must keep
 * stable.
 */
const getMonthAtTop = (datetime: Locator) =>
  datetime.locator('.calendar-body').evaluate((body: HTMLElement) => {
    const top = body.getBoundingClientRect().top;
    const month = Array.from(body.querySelectorAll<HTMLElement>('.calendar-month')).find(
      (el) => Math.abs(el.getBoundingClientRect().top - top) < 1
    );
    return month ? `${month.dataset.year}-${month.dataset.month}` : undefined;
  });

const getFirstRenderedMonth = (datetime: Locator) =>
  datetime.locator('.calendar-body').evaluate((body: HTMLElement) => {
    const month = body.querySelector<HTMLElement>('.calendar-month')!;
    return `${month.dataset.year}-${month.dataset.month}`;
  });

const scrollByMonths = (datetime: Locator, months: number) =>
  datetime.locator('.calendar-body').evaluate((body: HTMLElement, months: number) => {
    body.scrollTop += months * body.querySelector<HTMLElement>('.calendar-month')!.offsetHeight;
  }, months);

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: navigation orientation'), () => {
    test('should scroll on the y axis without snapping', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const metrics = await page.locator('ion-datetime .calendar-body').evaluate((body: HTMLElement) => ({
        scrollsVertically: body.scrollHeight > body.clientHeight,
        scrollsHorizontally: body.scrollWidth > body.clientWidth,
        snapType: getComputedStyle(body).scrollSnapType,
        snapAlign: getComputedStyle(body.querySelector('.calendar-month')!).scrollSnapAlign,
      }));

      expect(metrics).toEqual({
        scrollsVertically: true,
        scrollsHorizontally: false,
        snapType: 'none',
        snapAlign: 'none',
      });
    });

    test('should start with the working month at the top', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      expect(await getMonthAtTop(page.locator('ion-datetime'))).toBe('2022-6');
    });

    test('should keep the month at the top as the window re-centers', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const windowBefore = await getFirstRenderedMonth(datetime);

      /**
       * A month at a time for over a year, which re-centers the window several
       * times. A re-center that shifted the list would leave the wrong month
       * at the top.
       */
      for (let i = 1; i <= 14; i++) {
        await scrollByMonths(datetime, 1);
        await page.waitForChanges();

        const date = new Date(2022, 5 + i, 1);
        await expect.poll(() => getMonthAtTop(datetime)).toBe(`${date.getFullYear()}-${date.getMonth() + 1}`);
      }

      // The window must have re-centered, or the test would pass without exercising anything.
      expect(await getFirstRenderedMonth(datetime)).not.toBe(windowBefore);
    });

    test('should announce the month at the top', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const announce = datetime.locator('.calendar-month-year-announce');

      await expect(announce).toHaveText('June 2022');

      await scrollByMonths(datetime, 1);

      await expect(announce).toHaveText('July 2022');
    });

    test('should contain scroll rather than chaining it to the page', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('ion-datetime .calendar-body')).toHaveCSS('overscroll-behavior-y', 'contain');
    });

    test('should end the list at min and max', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          navigation-orientation="vertical"
          value="2022-06-03"
          min="2022-03-01"
          max="2022-09-30"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const body = datetime.locator('.calendar-body');

      /**
       * The last month rendered and how far its bottom sits from the bottom of
       * the list, as "year-month:gap". There is no runway past a real min or
       * max, so at either end the list stops exactly at that month.
       */
      const getLastMonthAtBottom = () =>
        body.evaluate((el: HTMLElement) => {
          const months = el.querySelectorAll<HTMLElement>('.calendar-month');
          const last = months[months.length - 1];
          const gap = el.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom;
          return `${last.dataset.year}-${last.dataset.month}:${Math.round(gap)}`;
        });

      await body.evaluate((el: HTMLElement) => (el.scrollTop = 0));
      await expect.poll(() => getMonthAtTop(datetime)).toBe('2022-3');

      await body.evaluate((el: HTMLElement) => (el.scrollTop = el.scrollHeight));
      await expect.poll(getLastMonthAtBottom).toBe('2022-9:0');
    });

    test('should not render the month/year toggle or the previous/next buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime id="horizontal" presentation="date" value="2022-06-03"></ion-datetime>
        <ion-datetime id="vertical" presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('#horizontal.datetime-ready').waitFor();
      await page.locator('#vertical.datetime-ready').waitFor();

      const horizontal = page.locator('#horizontal');
      const vertical = page.locator('#vertical');

      await expect(horizontal.locator('.calendar-month-year-toggle')).toBeVisible();
      await expect(horizontal.locator('.calendar-next-prev ion-button')).toHaveCount(2);

      await expect(vertical.locator('.calendar-action-buttons')).toHaveCount(0);

      // The day-of-week row stays, since every month below shares it.
      await expect(vertical.locator('.calendar-days-of-week')).toBeVisible();
    });

    /**
     * `date-time` and `time-date` also render a time row, which shares the
     * height the list is measured against.
     */
    ['date', 'date-time', 'time-date'].forEach((presentation) => {
      test(`should scroll vertically for presentation="${presentation}"`, async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            presentation="${presentation}"
            navigation-orientation="vertical"
            value="2022-06-03T09:30:00"
          ></ion-datetime>
        `,
          config
        );
        await page.locator('.datetime-ready').waitFor();

        const datetime = page.locator('ion-datetime');
        const scrollsVertically = await datetime
          .locator('.calendar-body')
          .evaluate((body: HTMLElement) => body.scrollHeight > body.clientHeight);

        expect(scrollsVertically).toBe(true);
        expect(await getMonthAtTop(datetime)).toBe('2022-6');
      });
    });

    test('should move by month and by year with the keyboard', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const day = (year: number, month: number, date: number) =>
        datetime.locator(`.calendar-day[data-year="${year}"][data-month="${month}"][data-day="${date}"]`);

      await day(2022, 6, 3).focus();

      await page.keyboard.press('PageDown');
      await expect(day(2022, 7, 3)).toBeFocused();

      // A year away is outside the rendered window, so it has to be rendered and scrolled to first.
      await page.keyboard.press('Shift+PageDown');
      await expect(day(2023, 7, 3)).toBeFocused();
      await expect.poll(() => getMonthAtTop(datetime)).toBe('2023-7');
    });

    test('should scroll to a value set programmatically', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const setValue = (value: string) =>
        datetime.evaluate((el: HTMLIonDatetimeElement, value: string) => (el.value = value), value);

      // A day already at the top of the list does not move it.
      await setValue('2022-06-20');
      await page.waitForChanges();
      expect(await getMonthAtTop(datetime)).toBe('2022-6');

      await setValue('2027-03-15');
      await expect.poll(() => getMonthAtTop(datetime)).toBe('2027-3');

      await setValue('2019-11-15');
      await expect.poll(() => getMonthAtTop(datetime)).toBe('2019-11');
    });

    test('should close the month/year picker when switched to vertical', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');

      /**
       * Horizontal positions its first month with a scroll, and its listener
       * reads the month from that scroll 50ms later. Opening the picker before
       * then hides the body, the listener reads its scroll position as 0, and
       * takes it as a swipe to the previous month. No user opens the picker
       * that fast, so the test waits for the listener rather than racing it.
       */
      await page.waitForTimeout(100);

      await datetime.locator('.calendar-month-year-toggle').click();
      await expect(datetime).toHaveClass(/show-month-and-year/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.navigationOrientation = 'vertical'));
      await page.waitForChanges();

      /**
       * Vertical has no toggle to close the picker with, so leaving it open
       * would leave the user stuck in it.
       */
      await expect(datetime).not.toHaveClass(/show-month-and-year/);
      await expect(datetime.locator('.calendar-body')).toHaveCSS('scroll-snap-type', 'none');
      await expect.poll(() => getMonthAtTop(datetime)).toBe('2022-6');
    });

    test('should ignore showAdjacentDays and warn', async ({ page }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          navigation-orientation="vertical"
          value="2022-06-03"
          show-adjacent-days="true"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('ion-datetime .calendar-day-adjacent-day')).toHaveCount(0);

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(
        '[ion-datetime] - showAdjacentDays has no effect when navigationOrientation="vertical".'
      );
    });

    test('should fill its container with size="cover"', async ({ page }) => {
      await page.setContent(
        `
        <div style="height: 800px">
          <ion-datetime
            id="cover"
            presentation="date"
            navigation-orientation="vertical"
            value="2022-06-03"
            size="cover"
          ></ion-datetime>
        </div>
        <ion-datetime id="default" presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('#cover.datetime-ready').waitFor();
      await page.locator('#default.datetime-ready').waitFor();

      const cover = await page.locator('#cover').boundingBox();
      const coverBody = await page.locator('#cover .calendar-body').boundingBox();
      const defaultBody = await page.locator('#default .calendar-body').boundingBox();

      expect(cover!.height).toBeCloseTo(800, 0);
      expect(coverBody!.height).toBeGreaterThan(defaultBody!.height);
    });

    test('should fill a height set on the datetime', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          navigation-orientation="vertical"
          value="2022-06-03"
          style="height: 800px"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = await page.locator('ion-datetime').boundingBox();
      const header = await page.locator('ion-datetime .calendar-header').boundingBox();
      const body = await page.locator('ion-datetime .calendar-body').boundingBox();

      expect(datetime!.height).toBeCloseTo(800, 0);
      expect(header!.height + body!.height).toBeCloseTo(800, 0);
    });

    test('should keep its default height with size="cover" in a container without a height', async ({ page }) => {
      await page.setContent(
        `
        <div>
          <ion-datetime
            id="cover"
            presentation="date"
            navigation-orientation="vertical"
            value="2022-06-03"
            size="cover"
          ></ion-datetime>
        </div>
        <ion-datetime id="default" presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('#cover.datetime-ready').waitFor();
      await page.locator('#default.datetime-ready').waitFor();

      const coverBody = await page.locator('#cover .calendar-body').boundingBox();
      const defaultBody = await page.locator('#default .calendar-body').boundingBox();

      expect(coverBody!.height).toBeCloseTo(defaultBody!.height, 0);
    });
  });
});

/**
 * The vertical sizes each theme is expected to render. A month block is the
 * heading plus its grid: six week rows inside the grid's top and bottom
 * padding, which matches horizontal. The list's default height is one block
 * plus the start of the next month, its heading and two of its weeks.
 */
const VERTICAL_SIZES = {
  md: { heading: 40, gridPadding: 4, row: 42 },
  ios: { heading: 40, gridPadding: 8, row: 40 },
  ionic: { heading: 40, gridPadding: 0, row: 48 },
};

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: navigation orientation: layout'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime
          presentation="date"
          navigation-orientation="vertical"
          value="2022-06-03"
          min="2022-01-01"
          max="2022-12-31"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();
    });

    test('should render one month and the start of the next', async ({ page }) => {
      await expect(page.locator('ion-datetime')).toHaveScreenshot(
        screenshot('datetime-navigation-orientation-vertical')
      );
    });

    /**
     * Each theme sets its vertical sizes in its own stylesheet, from its own
     * heading and day height, and the scroll arithmetic assumes every month is
     * exactly one block tall. A style change that is not carried through to
     * the vertical rules breaks that silently: the list still scrolls, but
     * re-centering and gliding land on the wrong month. So the rendered sizes
     * are checked against each other, not only against these numbers.
     */
    test('should size every month as one block of a heading and six rows', async ({ page }) => {
      const layout = await page.locator('ion-datetime .calendar-body').evaluate((body: HTMLElement) => {
        const months = Array.from(body.querySelectorAll<HTMLElement>('.calendar-month'));
        const bodyTop = body.getBoundingClientRect().top - body.scrollTop;

        return {
          body: body.getBoundingClientRect().height,
          scrollHeight: body.scrollHeight,
          scrollTop: body.scrollTop,
          months: months.map((month) => ({
            key: `${month.dataset.year}-${month.dataset.month}`,
            top: month.getBoundingClientRect().top - bodyTop,
            height: month.getBoundingClientRect().height,
            heading: month.querySelector<HTMLElement>('.calendar-month-heading')!.getBoundingClientRect().height,
            rows: getComputedStyle(month.querySelector('.calendar-month-grid')!)
              .gridTemplateRows.split(' ')
              .map((row) => parseFloat(row)),
          })),
        };
      });

      const { heading, gridPadding, row } = VERTICAL_SIZES[config.theme];
      const block = heading + 2 * gridPadding + 6 * row;

      expect(layout.months.length).toBeGreaterThan(0);

      for (const month of layout.months) {
        expect(month.heading).toBeCloseTo(heading, 0);
        expect(month.rows).toEqual(Array(6).fill(row));
        expect(month.height).toBeCloseTo(block, 0);
      }

      expect(layout.body).toBeCloseTo(block + heading + gridPadding + 2 * row, 0);

      /**
       * Every month of the range takes one block, rendered or runway, so the
       * position of a month is its index in the range times the block height.
       * This is the arithmetic re-centering and gliding rely on.
       */
      expect(layout.scrollHeight).toBeCloseTo(12 * block, 0);

      for (const month of layout.months) {
        const index = Number(month.key.split('-')[1]) - 1;
        expect(month.top).toBeCloseTo(index * block, 0);
      }

      // The working month starts at the top of the list.
      expect(layout.scrollTop).toBeCloseTo(5 * block, 0);
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: navigation orientation: scroll position'), () => {
    /**
     * WebKit ends a flick the moment `scrollTop` is written, even a write that
     * does not move the list. So nothing may write the scroll position while
     * the user is scrolling, or flicks on iOS stop as soon as the finger lifts.
     * This checks the cause, since a test cannot produce a real flick.
     */
    test('should not write the scroll position while the user scrolls', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const calendarBody = page.locator('ion-datetime .calendar-body');

      await calendarBody.evaluate((el: HTMLElement) => {
        const writes: string[] = [];
        (window as any).scrollPositionWrites = writes;

        const scrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')!;

        /**
         * The test scrolls through the browser's own setter, which bypasses
         * the recording below, so only the component's writes are counted.
         * It still fires real scroll events, as a user's scroll would.
         */
        (window as any).scrollAsUser = (delta: number) => scrollTop.set!.call(el, scrollTop.get!.call(el) + delta);

        Object.defineProperty(el, 'scrollTop', {
          get() {
            return scrollTop.get!.call(this);
          },
          set(value: number) {
            writes.push(`scrollTop = ${value}`);
            scrollTop.set!.call(this, value);
          },
        });

        for (const method of ['scrollTo', 'scrollBy'] as const) {
          const original = el[method].bind(el) as (...args: unknown[]) => void;
          (el as any)[method] = (...args: unknown[]) => {
            writes.push(method);
            original(...args);
          };
        }
      });

      const firstRenderedMonth = () =>
        calendarBody.evaluate((el: HTMLElement) => {
          const month = el.querySelector<HTMLElement>('.calendar-month')!;
          return `${month.dataset.year}-${month.dataset.month}`;
        });

      const windowBefore = await firstRenderedMonth();

      // Scroll through about a year of months, which re-centers the window several times.
      for (let i = 0; i < 12; i++) {
        await page.evaluate(() => (window as any).scrollAsUser(300));
        await page.waitForChanges();
      }

      // The window must have re-centered, or the test would pass without exercising anything.
      expect(await firstRenderedMonth()).not.toBe(windowBefore);

      expect(await page.evaluate(() => (window as any).scrollPositionWrites)).toEqual([]);
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: navigation orientation: navigation controls'), () => {
    test('should show the selected date and the input mode toggle in vertical with no title', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const bar = page.locator('ion-datetime .calendar-header .datetime-selected-date-bar');

      await expect(bar).toBeVisible();
      await expect(bar.locator('.datetime-selected-date-bar-text')).toHaveText('Fri, Jun 3');
      await expect(bar.locator('.datetime-input-mode-toggle')).toBeVisible();
    });

    test('should show a placeholder in the selected date bar with no value', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const text = page.locator('ion-datetime .datetime-selected-date-bar-text');

      await expect(text).toHaveText('Selected date');
      await expect(text).toHaveClass(/datetime-selected-date-placeholder/);
    });

    test('should jump to a typed date from the selected date bar', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetime = page.locator('ion-datetime');
      const toggle = datetime.locator('.datetime-selected-date-bar .datetime-input-mode-toggle');

      await toggle.click();
      await datetime.locator('.datetime-input ion-input input').fill('08/15/2027');
      await toggle.click();

      await expect.poll(() => getMonthAtTop(datetime)).toBe('2027-8');
      await expect(datetime.locator('.datetime-selected-date-bar-text')).toHaveText('Sun, Aug 15');
    });

    test('should not show the selected date bar with a title', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" value="2022-06-03" show-default-title="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      // The toggle is in the header instead, as in Material's picker.
      await expect(page.locator('ion-datetime .datetime-selected-date-bar')).toHaveCount(0);
      await expect(page.locator('ion-datetime .datetime-header .datetime-input-mode-toggle')).toBeVisible();
    });

    test('should not show the selected date bar with multiple', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" navigation-orientation="vertical" multiple="true"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('ion-datetime .datetime-selected-date-bar')).toHaveCount(0);
    });

    test('should hide the navigation controls in either orientation', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime id="horizontal" presentation="date" value="2022-06-03" show-navigation-controls="false"></ion-datetime>
        <ion-datetime
          id="vertical"
          presentation="date"
          navigation-orientation="vertical"
          value="2022-06-03"
          show-navigation-controls="false"
        ></ion-datetime>
        <ion-datetime
          id="titled"
          presentation="date"
          value="2022-06-03"
          show-default-title="true"
          show-navigation-controls="false"
        ></ion-datetime>
      `,
        config
      );
      await page.locator('#horizontal.datetime-ready').waitFor();
      await page.locator('#vertical.datetime-ready').waitFor();
      await page.locator('#titled.datetime-ready').waitFor();

      await expect(page.locator('#horizontal .calendar-action-buttons')).toHaveCount(0);
      await expect(page.locator('#vertical .datetime-selected-date-bar')).toHaveCount(0);

      // The days of the week stay in both.
      await expect(page.locator('#horizontal .calendar-days-of-week')).toBeVisible();
      await expect(page.locator('#vertical .calendar-days-of-week')).toBeVisible();

      // The header's toggle is not a navigation control, so it stays.
      await expect(page.locator('#titled .datetime-header .datetime-input-mode-toggle')).toBeVisible();
    });
  });
});
