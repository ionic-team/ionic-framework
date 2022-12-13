import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

const SINGLE_DATE = '2022-06-01';
const MULTIPLE_DATES = ['2022-06-01', '2022-06-02', '2022-06-03'];
const MULTIPLE_DATES_SEPARATE_MONTHS = ['2022-04-01', '2022-05-01', '2022-06-01'];

interface DatetimeMultipleConfig {
  multiple?: boolean;
  showDefaultTitle?: boolean;
  showDefaultButtons?: boolean;
  showClearButton?: boolean;
  customFormatter?: boolean;
}

class DatetimeMultipleFixture {
  readonly page: E2EPage;
  datetime!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  processValue(value: string | string[] = []) {
    if (!Array.isArray(value)) {
      return `'${value}'`;
    }

    const toString = value.map((v) => `'${v}'`).join(',');
    return `[${toString}]`;
  }

  async goto(value?: string | string[], config?: DatetimeMultipleConfig) {
    const { showDefaultButtons, showClearButton, showDefaultTitle, multiple, customFormatter } = config ?? {};

    const formattedValue = this.processValue(value);

    await this.page.setContent(`
      <ion-datetime
        locale="en-US"
        presentation="date"
        multiple="${multiple ?? true}"
        value="2022-04-19T04:20:00"
        show-default-title="${showDefaultTitle ?? false}"
        show-default-buttons="${showDefaultButtons ?? false}"
        show-clear-button="${showClearButton ?? false}"
      ></ion-datetime>

      <script>
        const datetime = document.querySelector('ion-datetime');
        datetime.value = ${formattedValue};

        if (${customFormatter}) {
          datetime.titleSelectedDatesFormatter = (selectedDates) => "Selected: " + selectedDates.length;
        }
      </script>
    `);

    this.datetime = this.page.locator('ion-datetime');
    await this.page.waitForSelector('.datetime-ready');

    return this.datetime;
  }

  async expectMultipleDatePicker(id: string) {
    expect(await this.datetime.screenshot()).toMatchSnapshot(
      `datetime-multiple-${id}-${this.page.getSnapshotSettings()}.png`
    );
  }
}

test.describe('datetime: multiple date selection (visual regressions)', () => {
  let datetimeFixture: DatetimeMultipleFixture;
  test.beforeEach(async ({ page }) => {
    datetimeFixture = new DatetimeMultipleFixture(page);
  });

  test('single default value should not have visual regressions', async () => {
    await datetimeFixture.goto(SINGLE_DATE);
    await datetimeFixture.expectMultipleDatePicker('singleDefaultValue');
  });

  test('multiple default values should not have visual regressions', async () => {
    await datetimeFixture.goto(MULTIPLE_DATES);
    await datetimeFixture.expectMultipleDatePicker('multipleDefaultValues');
  });

  test('header should not have visual regressions', async () => {
    await datetimeFixture.goto(SINGLE_DATE, { showDefaultTitle: true });
    await datetimeFixture.expectMultipleDatePicker('withHeader');
  });
});

test.describe('datetime: multiple date selection (functionality)', () => {
  let datetimeFixture: DatetimeMultipleFixture;
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'Multiple date selection functionality is the same across platforms');
    datetimeFixture = new DatetimeMultipleFixture(page);
  });

  test('clicking unselected days should select them', async ({ page }) => {
    const datetime = await datetimeFixture.goto(SINGLE_DATE);
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    const juneButtons = datetime.locator('[data-month="6"][data-day]');

    await juneButtons.nth(1).click();
    await ionChangeSpy.next();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-01', '2022-06-02']);

    await juneButtons.nth(2).click();
    await ionChangeSpy.next();
    await expect(datetime).toHaveJSProperty('value', MULTIPLE_DATES);

    for (let i = 0; i < 3; i++) {
      await expect(juneButtons.nth(i)).toHaveClass(/calendar-day-active/);
    }
  });

  test('clicking selected days should unselect them', async ({ page }) => {
    const datetime = await datetimeFixture.goto(MULTIPLE_DATES);
    const juneButtons = datetime.locator('[data-month="6"][data-day]');
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await juneButtons.nth(0).click();
    await ionChangeSpy.next();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-02', '2022-06-03']);

    await juneButtons.nth(1).click();
    await ionChangeSpy.next();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-03']);

    await juneButtons.nth(2).click();
    await ionChangeSpy.next();
    await expect(datetime).toHaveJSProperty('value', undefined);

    for (let i = 0; i < 3; i++) {
      await expect(juneButtons.nth(i)).not.toHaveClass(/calendar-day-active/);
    }
  });

  test('change event should emit with array detail', async ({ page }) => {
    const datetime = await datetimeFixture.goto(SINGLE_DATE);
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await june2Button.click();
    expect(ionChangeSpy).toHaveReceivedEventDetail({
      value: ['2022-06-01', '2022-06-02'],
    });
  });

  test('multiple default values across months should display at least one value', async () => {
    const datetime = await datetimeFixture.goto(MULTIPLE_DATES_SEPARATE_MONTHS);
    const monthYear = datetime.locator('.calendar-month-year');
    await expect(monthYear).toHaveText(/April 2022/);
  });

  test('multiple=false and array for default value should switch to first item', async () => {
    const datetime = await datetimeFixture.goto(MULTIPLE_DATES, { multiple: false });
    await expect(datetime).toHaveJSProperty('value', SINGLE_DATE);
  });

  test('with buttons, should only update value when confirm is called', async ({ page }) => {
    const datetime = await datetimeFixture.goto(SINGLE_DATE, { showDefaultButtons: true });
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');

    await june2Button.click();
    await page.waitForChanges();
    await expect(datetime).toHaveJSProperty('value', SINGLE_DATE); // value should not change yet

    await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());
    await expect(datetime).toHaveJSProperty('value', ['2022-06-01', '2022-06-02']);
  });

  test('clear button should work with multiple values', async () => {
    const datetime = await datetimeFixture.goto(SINGLE_DATE, { showClearButton: true, showDefaultButtons: true });
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const doneButton = datetime.locator('#confirm-button');
    const clearButton = datetime.locator('#clear-button');

    await june2Button.click();
    await doneButton.click();
    await clearButton.click();

    await expect(datetime).toHaveJSProperty('value', undefined);
  });

  test('setting value programmatically should update active days', async () => {
    const datetime = await datetimeFixture.goto(SINGLE_DATE);
    const juneButtons = datetime.locator('[data-month="6"][data-day]');

    await datetime.evaluate((el: HTMLIonDatetimeElement, dates: string[]) => {
      el.value = dates;
    }, MULTIPLE_DATES);

    for (let i = 0; i < 3; i++) {
      await expect(juneButtons.nth(i)).toHaveClass(/calendar-day-active/);
    }

    // ensure all days are still highlighted if we click another one after
    await juneButtons.nth(3).click();
    for (let i = 0; i < 4; i++) {
      await expect(juneButtons.nth(i)).toHaveClass(/calendar-day-active/);
    }
  });

  test('clicking day when no default value should set value to only clicked day', async ({ page }) => {
    const datetime = await datetimeFixture.goto();
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    // can't use specific data-month b/c no default value -- we don't know what it'll be
    const firstDayButton = datetime.locator('.calendar-month:nth-child(2) [data-day="1"]');

    const year = await firstDayButton.getAttribute('data-year');
    let month = await firstDayButton.getAttribute('data-month');
    if (month && month.length < 2) month = '0' + month; // pad with zero

    await firstDayButton.click();
    await ionChangeSpy.next();
    await expect(datetime).toHaveJSProperty('value', [`${year}-${month}-01`]);
  });

  test('header text should update correctly', async () => {
    const datetime = await datetimeFixture.goto(SINGLE_DATE, { showDefaultTitle: true });
    const header = datetime.locator('.datetime-selected-date');
    const juneButtons = datetime.locator('[data-month="6"][data-day]');

    await expect(header).toHaveText('Wed, Jun 1');

    await juneButtons.nth(1).click();
    await expect(header).toHaveText('2 days');

    await juneButtons.nth(0).click();
    await expect(header).toHaveText('Thu, Jun 2');

    await juneButtons.nth(1).click();
    await expect(header).toHaveText('0 days');
  });

  test('header text should update correctly with custom formatter', async () => {
    const datetime = await datetimeFixture.goto(MULTIPLE_DATES, { showDefaultTitle: true, customFormatter: true });
    const header = datetime.locator('.datetime-selected-date');
    const juneButtons = datetime.locator('[data-month="6"][data-day]');

    await expect(header).toHaveText('Selected: 3');

    await juneButtons.nth(1).click();
    await juneButtons.nth(2).click();
    await expect(header).toHaveText('Wed, Jun 1');

    await juneButtons.nth(0).click();
    await expect(header).toHaveText('Selected: 0');
  });

  test('header text should render default date when multiple="false"', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="en-US" show-default-title="true"></ion-datetime>

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
    `);
    await page.waitForSelector(`.datetime-ready`);
    const datetime = page.locator('ion-datetime');
    const header = datetime.locator('.datetime-selected-date');

    await expect(header).toHaveText('Mon, Oct 10');
  });
});
