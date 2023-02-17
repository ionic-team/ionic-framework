import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import type { SelectPopoverOption } from '../../select-popover-interface';
import { SelectPopoverPage } from '../fixtures';

const options: SelectPopoverOption[] = [
  { value: 'apple', text: 'Apple', disabled: false, checked: false },
  { value: 'banana', text: 'Banana', disabled: false, checked: false },
];

const checkedOptions: SelectPopoverOption[] = [
  { value: 'apple', text: 'Apple', disabled: false, checked: true },
  { value: 'banana', text: 'Banana', disabled: false, checked: false },
];

test.describe('select-popover: basic', () => {
  test.beforeEach(({ skip, browserName }) => {
    skip.rtl();
    skip.mode('ios', 'Consistent behavior across modes');
    test.skip(browserName === 'webkit', 'https://ionic-cloud.atlassian.net/browse/FW-2979');
  });

  test.describe('single selection', () => {
    let selectPopoverPage: SelectPopoverPage;

    test.beforeEach(async ({ page }) => {
      selectPopoverPage = new SelectPopoverPage(page);
    });

    test('clicking an unselected option should dismiss the popover', async () => {
      await selectPopoverPage.setup(options, false);

      await selectPopoverPage.clickOption('apple');
      await selectPopoverPage.ionPopoverDidDismiss.next();
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('clicking a selected option should dismiss the popover', async () => {
      await selectPopoverPage.setup(checkedOptions, false);

      await selectPopoverPage.clickOption('apple');
      await selectPopoverPage.ionPopoverDidDismiss.next();
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('pressing Space on an unselected option should dismiss the popover', async () => {
      await selectPopoverPage.setup(options, false);

      await selectPopoverPage.pressSpaceOnOption('apple');
      await selectPopoverPage.ionPopoverDidDismiss.next();
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });

    test('pressing Space on a selected option should dismiss the popover', async ({ browserName }) => {
      test.skip(browserName === 'firefox', 'Same behavior as https://ionic-cloud.atlassian.net/browse/FW-2979');

      await selectPopoverPage.setup(checkedOptions, false);

      await selectPopoverPage.pressSpaceOnOption('apple');
      await selectPopoverPage.ionPopoverDidDismiss.next();
      await expect(selectPopoverPage.popover).not.toBeVisible();
    });
  });
});
