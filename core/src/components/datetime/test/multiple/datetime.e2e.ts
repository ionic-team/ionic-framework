import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

const setup = async (page: E2EPage, datetimeID: string, shouldNavigate = true) => {
  if (shouldNavigate) await page.goto('/src/components/datetime/test/multiple/');
  const datetime = page.locator(`#${datetimeID}`);
  await datetime.scrollIntoViewIfNeeded();
  await page.waitForSelector(`#${datetimeID}.datetime-ready`);
  return datetime;
};

const screenshotDatetime = async (page: E2EPage, datetimeID: string) => {
  const datetime = await setup(page, datetimeID);
  expect(await datetime.screenshot()).toMatchSnapshot(
    `datetime-multiple-${datetimeID}-${page.getSnapshotSettings()}.png`
  );
};

test.describe('datetime: multiple date selection (visual regressions)', () => {
  test('single default value should not have visual regressions', async ({ page }) => {
    await screenshotDatetime(page, 'singleDefaultValue');
  });

  test('multiple default values should not have visual regressions', async ({ page }) => {
    await screenshotDatetime(page, 'multipleDefaultValues');
  });

  test('header should not have visual regressions', async ({ page }) => {
    await screenshotDatetime(page, 'withHeader');
  });
});

test.describe('datetime: multiple date selection (functionality)', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'Does not test LTR vs. RTL layout.');
  });

  test('clicking unselected days should select them', async ({ page }) => {
    const datetime = await setup(page, 'singleDefaultValue');
    const june1Button = datetime.locator('[data-month="6"][data-day="1"]');
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const june3Button = datetime.locator('[data-month="6"][data-day="3"]');

    await june2Button.click();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-01', '2022-06-02']);

    await june3Button.click();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-01', '2022-06-02', '2022-06-03']);

    await expect(june1Button).toHaveClass(/calendar-day-active/);
    await expect(june2Button).toHaveClass(/calendar-day-active/);
    await expect(june3Button).toHaveClass(/calendar-day-active/);
  });

  test('clicking selected days should unselect them', async ({ page }) => {
    const datetime = await setup(page, 'multipleDefaultValues');
    const june1Button = datetime.locator('[data-month="6"][data-day="1"]');
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const june3Button = datetime.locator('[data-month="6"][data-day="3"]');

    await june1Button.click();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-02', '2022-06-03']);

    await june2Button.click();
    await expect(datetime).toHaveJSProperty('value', ['2022-06-03']);

    await june3Button.click();
    await expect(datetime).toHaveJSProperty('value', undefined);

    await expect(june1Button).not.toHaveClass(/calendar-day-active/);
    await expect(june2Button).not.toHaveClass(/calendar-day-active/);
    await expect(june3Button).not.toHaveClass(/calendar-day-active/);
  });

  test('change event should emit with array detail', async ({ page }) => {
    const datetime = await setup(page, 'singleDefaultValue');
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const ionChangeSpy = await page.spyOnEvent('ionChange');

    await june2Button.click();
    expect(ionChangeSpy).toHaveReceivedEventDetail({
      value: ['2022-06-01', '2022-06-02'],
    });
  });

  test('multiple default values across months should display at least one value', async ({ page }) => {
    const datetime = await setup(page, 'multipleValuesSeparateMonths');
    const monthYear = datetime.locator('.calendar-month-year');
    await expect(monthYear).toHaveText('April 2022');
  });

  test('multiple=false and array for defaulut value should switch to first item', async ({ page }) => {
    const datetime = await setup(page, 'multipleFalseArrayValue');
    await expect(datetime).toHaveJSProperty('value', '2022-06-01');
  });

  test('with buttons, should only update value when confirm is called', async ({ page }) => {
    const datetime = await setup(page, 'withButtons');
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');

    await june2Button.click();
    await expect(datetime).toHaveJSProperty('value', '2022-06-01'); // value should not change yet

    await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm());
    await expect(datetime).toHaveJSProperty('value', ['2022-06-01', '2022-06-02']);
  });

  test('clear button should work with multiple values', async ({ page }) => {
    const datetime = await setup(page, 'withButtons');
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const doneButton = datetime.locator('#confirm-button');
    const clearButton = datetime.locator('#clear-button');

    await june2Button.click();
    await doneButton.click();
    await clearButton.click();

    await expect(datetime).toHaveJSProperty('value', undefined);
  });

  test('setting value programmatically should update active days', async ({ page }) => {
    const datetime = await setup(page, 'singleDefaultValue');
    const june1Button = datetime.locator('[data-month="6"][data-day="1"]');
    const june2Button = datetime.locator('[data-month="6"][data-day="2"]');
    const june3Button = datetime.locator('[data-month="6"][data-day="3"]');
    const june4Button = datetime.locator('[data-month="6"][data-day="4"]');

    await datetime.evaluate((el: HTMLIonDatetimeElement) => {
      el.value = ['2022-06-01', '2022-06-02', '2022-06-03'];
    });

    await expect(june1Button).toHaveClass(/calendar-day-active/);
    await expect(june2Button).toHaveClass(/calendar-day-active/);
    await expect(june3Button).toHaveClass(/calendar-day-active/);

    // ensure all days are still highlighted if we click another one after
    await june4Button.click();
    await expect(june1Button).toHaveClass(/calendar-day-active/);
    await expect(june2Button).toHaveClass(/calendar-day-active/);
    await expect(june3Button).toHaveClass(/calendar-day-active/);
    await expect(june4Button).toHaveClass(/calendar-day-active/);
  });

  test('clicking day when no default value should set value to only clicked day', async ({ page }) => {
    const datetime = await setup(page, 'noDefaultValue');

    // can't use specific data-month b/c no default value -- we don't know what it'll be
    const firstDayButton = datetime.locator('.calendar-month:nth-child(2) [data-day="1"]');

    const year = await firstDayButton.getAttribute('data-year');
    let month = await firstDayButton.getAttribute('data-month');
    if (month && month.length < 2) month = '0' + month; // pad with zero

    await firstDayButton.click();
    await expect(datetime).toHaveJSProperty('value', [`${year}-${month}-01`]);
  });
});
