import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const START_DATE = '2022-06-10';
const END_DATE = '2022-06-20';
const RANGE_VALUE = [START_DATE, END_DATE];

interface DatetimeRangeConfig {
  showDefaultButtons?: boolean;
  showClearButton?: boolean;
  min?: string;
  max?: string;
}

class DatetimeRangeFixture {
  readonly page: E2EPage;
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(
    config: E2EPageOptions,
    value?: string | string[],
    datetimeConfig: DatetimeRangeConfig = {}
  ): Promise<Locator> {
    const { showDefaultButtons = false, showClearButton = false, min, max } = datetimeConfig;

    const valueAttr = value
      ? Array.isArray(value)
        ? `value='["${value.join('","')}"]'`
        : `value="${value}"`
      : '';

    const minAttr = min ? `min="${min}"` : '';
    const maxAttr = max ? `max="${max}"` : '';

    await this.page.setContent(
      `
      <ion-datetime
        locale="en-US"
        presentation="date"
        selection-mode="range"
        ${valueAttr}
        ${minAttr}
        ${maxAttr}
        show-default-buttons="${showDefaultButtons}"
        show-clear-button="${showClearButton}"
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
 * Range selection functionality is the same across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: range selection (functionality)'), () => {
    let fixture: DatetimeRangeFixture;

    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeRangeFixture(page);
    });

    test('first click sets the range start but does not fire ionChange', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      await june10.click();
      await page.waitForChanges();

      // ionChange should NOT fire until both start and end are committed
      expect(ionChangeSpy.events.length).toBe(0);
      await expect(june10).toHaveClass(/calendar-day-range-start/);
    });

    test('second click sets range end and fires ionChange', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');

      await june10.click();
      await page.waitForChanges();
      await june20.click();
      await ionChangeSpy.next();

      await expect(datetime).toHaveJSProperty('value', RANGE_VALUE);
    });

    test('clicking end before start swaps them so start is always earlier', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      // click end first, then start (reverse order)
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');
      const june10 = datetime.locator('[data-month="6"][data-day="10"]');

      await june20.click();
      await page.waitForChanges();
      await june10.click();
      await ionChangeSpy.next();

      // value should be [start, end] regardless of click order
      await expect(datetime).toHaveJSProperty('value', RANGE_VALUE);
    });

    test('third click starts a new range (replaces previous selection)', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');
      const june15 = datetime.locator('[data-month="6"][data-day="15"]');

      await june10.click();
      await page.waitForChanges();
      await june20.click();
      await ionChangeSpy.next();

      // third click — should reset start
      await june15.click();
      await page.waitForChanges();

      // ionChange should not have fired again yet (partial range)
      expect(ionChangeSpy.events.length).toBe(1);
      await expect(june15).toHaveClass(/calendar-day-range-start/);
    });

    test('loading a two-element value prop sets the range', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);

      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');
      const june15 = datetime.locator('[data-month="6"][data-day="15"]');

      await expect(june10).toHaveClass(/calendar-day-range-start/);
      await expect(june20).toHaveClass(/calendar-day-range-end/);
      await expect(june15).toHaveClass(/calendar-day-in-range/);
    });

    test('start day should have range-start CSS class and be active', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const june10 = datetime.locator('[data-month="6"][data-day="10"]');

      await expect(june10).toHaveClass(/calendar-day-active/);
      await expect(june10).toHaveClass(/calendar-day-range-start/);
    });

    test('end day should have range-end CSS class and be active', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');

      await expect(june20).toHaveClass(/calendar-day-active/);
      await expect(june20).toHaveClass(/calendar-day-range-end/);
    });

    test('in-range days should have in-range CSS class but not be active', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);

      for (let day = 11; day <= 19; day++) {
        const btn = datetime.locator(`[data-month="6"][data-day="${day}"]`);
        await expect(btn).toHaveClass(/calendar-day-in-range/);
        await expect(btn).not.toHaveClass(/calendar-day-active/);
      }
    });

    test('days outside the range should not have range CSS classes', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const june5 = datetime.locator('[data-month="6"][data-day="5"]');

      await expect(june5).not.toHaveClass(/calendar-day-range-start/);
      await expect(june5).not.toHaveClass(/calendar-day-in-range/);
      await expect(june5).not.toHaveClass(/calendar-day-range-end/);
    });

    test('wrapper element for range-start should have the correct class', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const june10Wrapper = datetime.locator('[data-month="6"][data-day="10"]').locator('..');

      await expect(june10Wrapper).toHaveClass(/calendar-day-wrapper-range-start/);
    });

    test('wrapper element for in-range day should have the correct class', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const june15Wrapper = datetime.locator('[data-month="6"][data-day="15"]').locator('..');

      await expect(june15Wrapper).toHaveClass(/calendar-day-wrapper-in-range/);
    });

    test('wrapper element for range-end should have the correct class', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE);
      const june20Wrapper = datetime.locator('[data-month="6"][data-day="20"]').locator('..');

      await expect(june20Wrapper).toHaveClass(/calendar-day-wrapper-range-end/);
    });

    test('with buttons: value should not update until confirm is called', async ({ page }) => {
      const datetime = await fixture.goto(config, undefined, { showDefaultButtons: true });
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');

      await june10.click();
      await page.waitForChanges();
      await june20.click();
      await page.waitForChanges();

      // ionChange should not fire before confirm
      expect(ionChangeSpy.events.length).toBe(0);

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());
      await ionChangeSpy.next();

      await expect(datetime).toHaveJSProperty('value', RANGE_VALUE);
    });

    test('with buttons: cancel should discard pending range selection', async ({ page }) => {
      const datetime = await fixture.goto(config, START_DATE, { showDefaultButtons: true });

      const june20 = datetime.locator('[data-month="6"][data-day="20"]');
      await june20.click();
      await page.waitForChanges();

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.cancel(true));
      await page.waitForChanges();

      // value should remain as original single date
      await expect(datetime).toHaveJSProperty('value', START_DATE);
    });

    test('clear button should reset range selection', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE, {
        showDefaultButtons: true,
        showClearButton: true,
      });
      const clearButton = datetime.locator('#clear-button');

      await clearButton.click();
      await expect(datetime).toHaveJSProperty('value', undefined);
    });

    test('disabled days should not be part of in-range highlight', async () => {
      const datetime = await fixture.goto(config, RANGE_VALUE, {
        min: '2022-06-12', // days 10 and 11 are disabled (before min)
      });

      // june10 is disabled — it's before min, so not in-range even if it's the range start value loaded from prop
      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      // disabled days should not have calendar-day-in-range
      await expect(june10).not.toHaveClass(/calendar-day-in-range/);
    });

    test('ionChange event detail should contain the two ISO date strings', async ({ page }) => {
      const datetime = await fixture.goto(config);
      const ionChangeSpy = await page.spyOnEvent('ionChange');

      const june10 = datetime.locator('[data-month="6"][data-day="10"]');
      const june20 = datetime.locator('[data-month="6"][data-day="20"]');

      await june10.click();
      await page.waitForChanges();
      await june20.click();
      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEventDetail({ value: RANGE_VALUE });
    });
  });
});

/**
 * Visual regressions are tested across all modes and directions.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: range selection (visual regressions)'), () => {
    let fixture: DatetimeRangeFixture;

    test.beforeEach(async ({ page }) => {
      fixture = new DatetimeRangeFixture(page);
    });

    test('range selection should not have visual regressions', async () => {
      await fixture.goto(config, RANGE_VALUE);
      const datetime = fixture.datetime;
      await expect(datetime).toHaveScreenshot(screenshot('datetime-range-default'));
    });

    test('partial range (start only) should not have visual regressions', async () => {
      await fixture.goto(config, [START_DATE]);
      const datetime = fixture.datetime;
      await expect(datetime).toHaveScreenshot(screenshot('datetime-range-start-only'));
    });
  });
});
