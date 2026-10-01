import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * The month shown in the shared header is the observable side of
 * `workingParts`, so it is what these tests assert against.
 */
const getVisibleMonth = (page: E2EPage) => page.locator('ion-datetime#vertical .calendar-month-year-toggle');

const getCalendarBody = (page: E2EPage) => page.locator('ion-datetime#vertical .calendar-body');

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: navigation orientation'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/datetime/test/navigation-orientation', config);
      await page.locator('ion-datetime#vertical').waitFor({ state: 'visible' });
    });

    test('should scroll on the y axis, not the x axis', async ({ page }) => {
      const body = getCalendarBody(page);

      const metrics = await body.evaluate((el) => ({
        scrollsVertically: el.scrollHeight > el.clientHeight,
        scrollsHorizontally: el.scrollWidth > el.clientWidth,
      }));

      expect(metrics.scrollsVertically).toBe(true);
      expect(metrics.scrollsHorizontally).toBe(false);
    });

    test('should start scrolled to the working month', async ({ page }) => {
      const body = getCalendarBody(page);

      /**
       * The window is three months and the working month is the middle one,
       * so the initial offset is exactly one month down.
       */
      const offset = await body.evaluate((el) => {
        const month = el.querySelector('.calendar-month') as HTMLElement;
        return { scrollTop: el.scrollTop, monthHeight: month.clientHeight };
      });

      expect(offset.monthHeight).toBeGreaterThan(0);
      expect(Math.abs(offset.scrollTop - offset.monthHeight)).toBeLessThanOrEqual(2);
    });

    test('should snap one month at a time', async ({ page }) => {
      const body = getCalendarBody(page);

      await expect(getVisibleMonth(page)).toHaveText(/June 2022/);

      await body.evaluate((el) => {
        el.scrollTo({ top: el.scrollTop + el.clientHeight, behavior: 'instant' });
      });

      await expect(getVisibleMonth(page)).toHaveText(/July 2022/);

      await body.evaluate((el) => {
        el.scrollTo({ top: el.scrollTop - el.clientHeight, behavior: 'instant' });
      });

      await expect(getVisibleMonth(page)).toHaveText(/June 2022/);
    });

    test('should re-center the window after the month changes', async ({ page }) => {
      const body = getCalendarBody(page);

      await body.evaluate((el) => {
        el.scrollTo({ top: el.scrollTop + el.clientHeight, behavior: 'instant' });
      });

      await expect(getVisibleMonth(page)).toHaveText(/July 2022/);

      /**
       * Once the window regenerates around July, the scroll position must be
       * back at the middle month so there is a month of runway either way.
       */
      const offset = await body.evaluate((el) => {
        const month = el.querySelector('.calendar-month') as HTMLElement;
        return { scrollTop: el.scrollTop, monthHeight: month.clientHeight };
      });

      expect(Math.abs(offset.scrollTop - offset.monthHeight)).toBeLessThanOrEqual(2);
    });

    test('should contain scroll rather than chaining it to the page', async ({ page }) => {
      const body = getCalendarBody(page);

      const overscroll = await body.evaluate((el) => getComputedStyle(el).overscrollBehaviorY);

      expect(overscroll).toBe('contain');
    });

    test('should render at the same height as horizontal', async ({ page }) => {
      const vertical = page.locator('ion-datetime#vertical');
      const horizontal = page.locator('.grid-item:nth-of-type(1) ion-datetime');

      const verticalBox = await vertical.boundingBox();
      const horizontalBox = await horizontal.boundingBox();

      expect(verticalBox).not.toBeNull();
      expect(horizontalBox).not.toBeNull();
      expect(Math.abs(verticalBox!.height - horizontalBox!.height)).toBeLessThanOrEqual(2);
    });

    test('should keep the horizontal default unchanged', async ({ page }) => {
      const body = page.locator('.grid-item:nth-of-type(1) ion-datetime .calendar-body');

      const metrics = await body.evaluate((el) => ({
        scrollsHorizontally: el.scrollWidth > el.clientWidth,
        scrollsVertically: el.scrollHeight > el.clientHeight,
        snapType: getComputedStyle(el).scrollSnapType,
      }));

      expect(metrics.scrollsHorizontally).toBe(true);
      expect(metrics.scrollsVertically).toBe(false);
      expect(metrics.snapType).toBe('x mandatory');
    });

    /**
     * The three presentations that render a calendar grid. Vertical paging is
     * gated behind `isGridStyle`, so each one has to be covered: `date-time`
     * and `time-date` also render a time row, which shares the height the
     * calendar body is measured against.
     */
    ['date', 'date-time', 'time-date'].forEach((presentation) => {
      test(`should page vertically for presentation="${presentation}"`, async ({ page }) => {
        const body = page.locator(`ion-datetime#vertical-${presentation} .calendar-body`);

        await expect(body).toHaveCSS('scroll-snap-type', 'y mandatory');

        const metrics = await body.evaluate((el) => ({
          scrollsVertically: el.scrollHeight > el.clientHeight,
          scrollsHorizontally: el.scrollWidth > el.clientWidth,
          scrollTop: el.scrollTop,
          clientHeight: el.clientHeight,
        }));

        expect(metrics.scrollsVertically).toBe(true);
        expect(metrics.scrollsHorizontally).toBe(false);

        // Starts on the middle month of the three-month window.
        expect(Math.abs(metrics.scrollTop - metrics.clientHeight)).toBeLessThanOrEqual(2);
      });
    });

    test('should not render the navigation buttons in vertical', async ({ page }) => {
      await expect(page.locator('ion-datetime#vertical .calendar-next-prev ion-button')).toHaveCount(0);
    });

    test('should keep the navigation buttons in horizontal', async ({ page }) => {
      await expect(page.locator('.grid-item:nth-of-type(1) ion-datetime .calendar-next-prev ion-button')).toHaveCount(
        2
      );
    });

    test('should keep the month/year toggle in vertical', async ({ page }) => {
      await expect(getVisibleMonth(page)).toBeVisible();
      await expect(getVisibleMonth(page)).toHaveText(/June 2022/);
    });

    test('should navigate months by keyboard in vertical', async ({ page }) => {
      /**
       * Focusing the body passes focus to the working day, which is what the
       * PageUp/PageDown handler acts on.
       */
      await getCalendarBody(page).focus();

      await page.keyboard.press('PageDown');
      await expect(getVisibleMonth(page)).toHaveText(/July 2022/);

      await page.keyboard.press('PageUp');
      await expect(getVisibleMonth(page)).toHaveText(/June 2022/);
    });

    test('should rebuild the listener when the orientation changes at runtime', async ({ page }) => {
      const datetime = page.locator('ion-datetime#toggleable');
      const body = datetime.locator('.calendar-body');

      await expect(body).toHaveCSS('scroll-snap-type', 'x mandatory');

      await page.click('button:has-text("Toggle orientation")');
      await expect(body).toHaveCSS('scroll-snap-type', 'y mandatory');

      const metrics = await body.evaluate((el) => ({
        scrollsVertically: el.scrollHeight > el.clientHeight,
        scrollTop: el.scrollTop,
        monthHeight: (el.querySelector('.calendar-month') as HTMLElement).clientHeight,
      }));

      expect(metrics.scrollsVertically).toBe(true);
      expect(Math.abs(metrics.scrollTop - metrics.monthHeight)).toBeLessThanOrEqual(2);
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
