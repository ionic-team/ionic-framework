import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import type { SelectModalOption } from '../../select-modal-interface';
import { SelectModalPage } from '../fixtures';

const options: SelectModalOption[] = [
  { value: 'apple', text: 'Apple', disabled: false, checked: false },
  { value: 'banana', text: 'Banana', disabled: false, checked: false },
];

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select-modal: custom'), () => {
    let selectModalPage: SelectModalPage;

    test.beforeEach(async ({ page }) => {
      selectModalPage = new SelectModalPage(page);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test('should render custom cancel text when prop is provided', async ({ page: _page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30295',
      });

      await selectModalPage.setup(config, options, false);

      const cancelButton = selectModalPage.selectModal.locator('ion-button');

      // Verify the default text on the cancel button
      await expect(cancelButton).toHaveText('Close');

      await selectModalPage.selectModal.evaluate((selectModal: HTMLIonSelectModalElement) => {
        selectModal.cancelText = 'Close me';
      });

      // Verify the cancel button text has been updated
      await expect(cancelButton).toHaveText('Close me');
    });

    test('should render an icon on the cancel button when cancelIcon is true', async () => {
      await selectModalPage.setup(config, options, false);

      const cancelButton = selectModalPage.selectModal.locator('ion-button');

      // Verify no icon is shown by default
      await expect(cancelButton.locator('ion-icon')).not.toBeAttached();

      await selectModalPage.selectModal.evaluate((selectModal: HTMLIonSelectModalElement) => {
        selectModal.cancelIcon = true;
      });

      // Verify the icon is now rendered
      await expect(cancelButton.locator('ion-icon')).toBeAttached();
    });

    test('should use cancelText as aria-label on the cancel button when cancelIcon is true', async () => {
      await selectModalPage.setup(config, options, false);

      const cancelButton = selectModalPage.selectModal.locator('ion-button');

      await selectModalPage.selectModal.evaluate((selectModal: HTMLIonSelectModalElement) => {
        selectModal.cancelIcon = true;
        selectModal.cancelText = 'Dismiss';
      });

      await expect(cancelButton).toHaveAttribute('aria-label', 'Dismiss');
    });

    test('should not set aria-label on the cancel button when cancelIcon is false', async () => {
      await selectModalPage.setup(config, options, false);

      const cancelButton = selectModalPage.selectModal.locator('ion-button');

      await expect(cancelButton).not.toHaveAttribute('aria-label');
    });
  });
});

/**
 * Visual regression tests for cancelIcon across all themes.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select-modal: cancel icon'), () => {
    let selectModalPage: SelectModalPage;

    test.beforeEach(async ({ page }) => {
      selectModalPage = new SelectModalPage(page);
    });

    test('should not have visual regressions with cancelIcon', async () => {
      await selectModalPage.setup(config, options, false);

      await selectModalPage.selectModal.evaluate((selectModal: HTMLIonSelectModalElement) => {
        selectModal.cancelIcon = true;
      });

      await selectModalPage.screenshot(screenshot, 'select-modal-cancel-icon-diff');
    });
  });
});
