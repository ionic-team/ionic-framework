import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

class DatetimeMonthNavigationFixture {
  readonly page: E2EPage;
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions, monthNavigation: 'arrows' | 'scroll' = 'scroll'): Promise<Locator> {
    await this.page.setContent(
      `
      <ion-datetime
        locale="en-US"
        presentation="date"
        value="2022-06-15"
        month-navigation="${monthNavigation}"
      ></ion-datetime>
    `,
      config
    );

    this.datetime = this.page.locator('ion-datetime');
    await this.page.locator('.datetime-ready').waitFor();
    return this.datetime;
  }
}

/**
 * Month navigation functionality is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: monthNavigation="scroll" (functionality)'), () => {
    let fixture: DatetimeMonthNavigationFixture;

    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeMonthNavigationFixture(page);
    });

    test('host should have datetime-month-navigation-scroll class when monthNavigation="scroll"', async () => {
      const datetime = await fixture.goto(config, 'scroll');
      await expect(datetime).toHaveClass(/datetime-month-navigation-scroll/);
    });

    test('host should not have datetime-month-navigation-scroll class when monthNavigation="arrows"', async () => {
      const datetime = await fixture.goto(config, 'arrows');
      await expect(datetime).not.toHaveClass(/datetime-month-navigation-scroll/);
    });

    test('calendar-body should use vertical scroll axis when monthNavigation="scroll"', async () => {
      const datetime = await fixture.goto(config, 'scroll');
      const calendarBody = datetime.locator('.calendar-body');

      // Verify flex-direction is column (vertical axis)
      const flexDirection = await calendarBody.evaluate(
        (el) => window.getComputedStyle(el).flexDirection
      );
      expect(flexDirection).toBe('column');

      // Verify overflow is vertical
      const overflowY = await calendarBody.evaluate(
        (el) => window.getComputedStyle(el).overflowY
      );
      expect(overflowY).toBe('scroll');
    });

    test('calendar-body should use horizontal scroll axis when monthNavigation="arrows"', async () => {
      const datetime = await fixture.goto(config, 'arrows');
      const calendarBody = datetime.locator('.calendar-body');

      const flexDirection = await calendarBody.evaluate(
        (el) => window.getComputedStyle(el).flexDirection
      );
      expect(flexDirection).toBe('row');
    });

    test('arrow buttons container should be hidden in scroll mode', async () => {
      const datetime = await fixture.goto(config, 'scroll');
      const nextPrev = datetime.locator('.calendar-next-prev');

      // Arrows are hidden via CSS (display: none) — navigation is done by gesture
      await expect(nextPrev).not.toBeVisible();
    });

    test('arrow buttons container should be visible in arrows mode', async () => {
      const datetime = await fixture.goto(config, 'arrows');
      const nextPrev = datetime.locator('.calendar-next-prev');

      await expect(nextPrev).toBeVisible();
    });

    test('arrows mode: next button click should navigate to next month', async ({ page }) => {
      const datetime = await fixture.goto(config, 'arrows');
      const nextButton = datetime.locator('.calendar-next-prev ion-button:nth-child(2)');
      const monthYear = datetime.locator('.calendar-month-year');

      await expect(monthYear).toHaveText(/June 2022/);
      await nextButton.click();
      await page.waitForChanges();

      await expect(monthYear).toHaveText(/July 2022/);
    });

    test('arrows mode: prev button click should navigate to previous month', async ({ page }) => {
      const datetime = await fixture.goto(config, 'arrows');
      const prevButton = datetime.locator('.calendar-next-prev ion-button:nth-child(1)');
      const monthYear = datetime.locator('.calendar-month-year');

      await expect(monthYear).toHaveText(/June 2022/);
      await prevButton.click();
      await page.waitForChanges();

      await expect(monthYear).toHaveText(/May 2022/);
    });

    test('aria-live region should be present for screen reader announcements', async () => {
      const datetime = await fixture.goto(config, 'scroll');
      const liveRegion = datetime.locator('.calendar-month-year-announce');

      await expect(liveRegion).toBeAttached();
      await expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    test('programmatic nextMonth() should navigate to next month in scroll mode', async ({ page }) => {
      const datetime = await fixture.goto(config, 'scroll');
      const monthYear = datetime.locator('.calendar-month-year');

      await expect(monthYear).toHaveText(/June 2022/);

      // Trigger navigation programmatically (simulates swipe-based snap completion)
      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el as any).nextMonth());
      await page.waitForChanges();

      await expect(monthYear).toHaveText(/July 2022/);
    });

    test('programmatic prevMonth() should navigate to previous month in scroll mode', async ({ page }) => {
      const datetime = await fixture.goto(config, 'scroll');
      const monthYear = datetime.locator('.calendar-month-year');

      await expect(monthYear).toHaveText(/June 2022/);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el as any).prevMonth());
      await page.waitForChanges();

      await expect(monthYear).toHaveText(/May 2022/);
    });
  });
});

/**
 * Visual regressions tested across all modes and directions.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: monthNavigation (visual regressions)'), () => {
    test('scroll mode should not have visual regressions', async ({ page }) => {
      const fixture = new DatetimeMonthNavigationFixture(page);
      await fixture.goto(config, 'scroll');
      await expect(fixture.datetime).toHaveScreenshot(screenshot('datetime-month-navigation-scroll'));
    });

    test('arrows mode (default) should not have visual regressions', async ({ page }) => {
      const fixture = new DatetimeMonthNavigationFixture(page);
      await fixture.goto(config, 'arrows');
      await expect(fixture.datetime).toHaveScreenshot(screenshot('datetime-month-navigation-arrows'));
    });
  });
});
