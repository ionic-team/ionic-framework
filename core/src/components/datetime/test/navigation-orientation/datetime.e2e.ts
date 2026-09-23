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

    test('should navigate with the previous and next buttons', async ({ page }) => {
      const datetime = page.locator('ion-datetime#vertical');

      await datetime.locator('.calendar-next-prev ion-button:nth-of-type(2)').click();
      await expect(getVisibleMonth(page)).toHaveText(/July 2022/);

      await datetime.locator('.calendar-next-prev ion-button:nth-of-type(1)').click();
      await expect(getVisibleMonth(page)).toHaveText(/June 2022/);
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

    test('should render the navigation buttons by default', async ({ page }) => {
      const buttons = page.locator('ion-datetime#vertical .calendar-next-prev ion-button');

      await expect(buttons).toHaveCount(2);
    });

    test('should hide the navigation buttons when showNavigationButtons is false', async ({ page }) => {
      const buttons = page.locator('ion-datetime#vertical-no-arrows .calendar-next-prev ion-button');

      await expect(buttons).toHaveCount(0);
    });

    test('should hide the navigation buttons in horizontal mode too', async ({ page }) => {
      const datetime = page.locator('ion-datetime#horizontal-no-arrows');
      const buttons = datetime.locator('.calendar-next-prev ion-button');

      await expect(buttons).toHaveCount(0);

      /**
       * The prop is independent of the axis, so hiding the buttons must not
       * switch the component over to vertical paging.
       */
      await expect(datetime.locator('.calendar-body')).toHaveCSS('scroll-snap-type', 'x mandatory');
    });

    test('should keep the month/year toggle when the buttons are hidden', async ({ page }) => {
      const toggle = page.locator('ion-datetime#vertical-no-arrows .calendar-month-year-toggle');

      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveText(/June 2022/);
    });

    test('should still navigate months by keyboard when the buttons are hidden', async ({ page }) => {
      const datetime = page.locator('ion-datetime#vertical-no-arrows');
      const toggle = datetime.locator('.calendar-month-year-toggle');

      /**
       * Focusing the body passes focus to the working day, which is what the
       * PageUp/PageDown handler acts on.
       */
      await datetime.locator('.calendar-body').focus();

      await page.keyboard.press('PageDown');
      await expect(toggle).toHaveText(/July 2022/);

      await page.keyboard.press('PageUp');
      await expect(toggle).toHaveText(/June 2022/);
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
