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
  });
});
