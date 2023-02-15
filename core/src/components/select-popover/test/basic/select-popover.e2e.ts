import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import type { SelectPopoverOption } from '../../select-popover-interface';
import { SelectPopoverPage } from '../fixtures';

test.describe('select-popover: basic', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Consistent behavior across modes');
  });

  const options: SelectPopoverOption[] = [
    { value: 'apple', text: 'Apple', disabled: false, checked: false },
    { value: 'banana', text: 'Banana', disabled: false, checked: false },
  ];

  test.describe('single selection', () => {
    let selectPopoverPage: SelectPopoverPage;

    test.beforeEach(async ({ page }) => {
      selectPopoverPage = new SelectPopoverPage(page);
      await selectPopoverPage.setup(options, false);
    });

    test('clicking an option should dismiss the popover', async () => {
      await selectPopoverPage.clickOption('apple');
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('clicking a selected option should dismiss the popover', async () => {
      await selectPopoverPage.updateOptions([
        { value: 'apple', text: 'Apple', disabled: false, checked: true },
        { value: 'banana', text: 'Banana', disabled: false, checked: false },
      ]);

      await selectPopoverPage.clickOption('apple');
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('pressing Enter on an option should dismiss the popover', async () => {
      await selectPopoverPage.pressEnterOnOption('apple');
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('pressing Enter on a selected option should dismiss the popover', async () => {
      await selectPopoverPage.updateOptions([
        { value: 'apple', text: 'Apple', disabled: false, checked: true },
        { value: 'banana', text: 'Banana', disabled: false, checked: false },
      ]);

      await selectPopoverPage.pressEnterOnOption('apple');
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('pressing Space on an option should dismiss the popover', async () => {
      await selectPopoverPage.pressSpaceOnOption('apple');
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('pressing Space on a selected option should dismiss the popover', async () => {
      await selectPopoverPage.updateOptions([
        { value: 'apple', text: 'Apple', disabled: false, checked: true },
        { value: 'banana', text: 'Banana', disabled: false, checked: false },
      ]);

      await selectPopoverPage.pressSpaceOnOption('apple');
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });
  });

  test.describe('multiple selection', () => {
    let selectPopoverPage: SelectPopoverPage;

    test.beforeEach(async ({ page }) => {
      selectPopoverPage = new SelectPopoverPage(page);
      await selectPopoverPage.setup(options, true);
    });

    test('clicking an option should not dismiss the popover', async () => {
      await selectPopoverPage.clickOption('apple');
      await expect(selectPopoverPage.popover).toBeVisible();
    });

    test('clicking a selected option should not dismiss the popover', async () => {
      await selectPopoverPage.updateOptions([
        { value: 'apple', text: 'Apple', disabled: false, checked: true },
        { value: 'banana', text: 'Banana', disabled: false, checked: false },
      ]);

      await selectPopoverPage.clickOption('apple');
      await expect(selectPopoverPage.popover).toBeVisible();
    });

    test('pressing Enter on an option should not dismiss the popover', async () => {
      await selectPopoverPage.pressEnterOnOption('apple');
      await expect(selectPopoverPage.popover).toBeVisible();
    });

    test('pressing Enter on a selected option should not dismiss the popover', async () => {
      await selectPopoverPage.updateOptions([
        { value: 'apple', text: 'Apple', disabled: false, checked: true },
        { value: 'banana', text: 'Banana', disabled: false, checked: false },
      ]);

      await selectPopoverPage.pressEnterOnOption('apple');
      await expect(selectPopoverPage.popover).toBeVisible();
    });

    test('pressing Space on an option should not dismiss the popover', async () => {
      await selectPopoverPage.pressSpaceOnOption('apple');
      await expect(selectPopoverPage.popover).toBeVisible();
    });

    test('pressing Space on a selected option should not dismiss the popover', async () => {
      await selectPopoverPage.updateOptions([
        { value: 'apple', text: 'Apple', disabled: false, checked: true },
        { value: 'banana', text: 'Banana', disabled: false, checked: false },
      ]);

      await selectPopoverPage.pressSpaceOnOption('apple');
      await expect(selectPopoverPage.popover).toBeVisible();
    });
  });
});
