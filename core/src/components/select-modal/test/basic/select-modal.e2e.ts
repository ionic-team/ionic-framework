import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import type { SelectModalOption } from '../../select-modal-interface';
import { SelectModalPage } from '../fixtures';

const options: SelectModalOption[] = [
  { value: 'apple', text: 'Apple', disabled: false, checked: false },
  { value: 'banana', text: 'Banana', disabled: false, checked: false },
];

const checkedOptions: SelectModalOption[] = [
  { value: 'apple', text: 'Apple', disabled: false, checked: true },
  { value: 'banana', text: 'Banana', disabled: false, checked: false },
];

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select-modal: basic'), () => {
    test.beforeEach(({ browserName }) => {
      test.skip(browserName === 'webkit', 'ROU-5437');
    });

    test.describe('single selection', () => {
      let selectModalPage: SelectModalPage;

      test.beforeEach(async ({ page }) => {
        selectModalPage = new SelectModalPage(page);
      });

      test('clicking an unselected option should dismiss the modal', async () => {
        await selectModalPage.setup(config, options, false);

        await selectModalPage.clickOption('apple');
        await selectModalPage.ionModalDidDismiss.next();
        await expect(selectModalPage.modal).not.toBeVisible();
      });

      test('clicking a selected option should dismiss the modal', async () => {
        await selectModalPage.setup(config, checkedOptions, false);

        await selectModalPage.clickOption('apple');
        await selectModalPage.ionModalDidDismiss.next();
        await expect(selectModalPage.modal).not.toBeVisible();
      });

      test('pressing Space on an unselected option should dismiss the modal', async () => {
        await selectModalPage.setup(config, options, false);

        await selectModalPage.pressSpaceOnOption('apple');
        await selectModalPage.ionModalDidDismiss.next();
        await expect(selectModalPage.modal).not.toBeVisible();
      });

      test('pressing Space on a selected option should dismiss the modal', async ({ browserName }) => {
        test.skip(browserName === 'firefox', 'Same behavior as ROU-5437');

        await selectModalPage.setup(config, checkedOptions, false);

        await selectModalPage.pressSpaceOnOption('apple');
        await selectModalPage.ionModalDidDismiss.next();
        await expect(selectModalPage.modal).not.toBeVisible();
      });

      test('clicking the close button should dismiss the modal', async () => {
        await selectModalPage.setup(config, options, false);

        const closeButton = selectModalPage.modal.locator('ion-header ion-toolbar ion-button');
        await closeButton.click();
        await selectModalPage.ionModalDidDismiss.next();
        await expect(selectModalPage.modal).not.toBeVisible();
      });
    });
  });
});

/**
 * This behavior does not vary across directions.
 * The components used inside of `ion-select-modal`
 * do have RTL logic, but those are tested in their
 * respective component test files.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select-modal: rendering'), () => {
    let selectModalPage: SelectModalPage;

    test.beforeEach(async ({ page }) => {
      selectModalPage = new SelectModalPage(page);
    });
    test('should not have visual regressions with single selection', async () => {
      await selectModalPage.setup(config, checkedOptions, false);
      await selectModalPage.screenshot(screenshot, 'select-modal-diff');
    });
    test('should not have visual regressions with multiple selection', async () => {
      await selectModalPage.setup(config, checkedOptions, true);
      await selectModalPage.screenshot(screenshot, 'select-modal-multiple-diff');
    });
  });
});
