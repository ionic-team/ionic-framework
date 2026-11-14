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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      test('pressing Enter on an unselected option should dismiss the modal', async ({ page: _page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
        });

        await selectModalPage.setup(config, options, false);

        await selectModalPage.pressEnterOnOption('apple');
        await selectModalPage.ionModalDidDismiss.next();
        await expect(selectModalPage.modal).not.toBeVisible();
      });

      test('pressing Enter on a selected option should dismiss the modal', async ({ browserName }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
        });

        test.skip(browserName === 'firefox', 'Same behavior as ROU-5437');

        await selectModalPage.setup(config, checkedOptions, false);

        await selectModalPage.pressEnterOnOption('apple');
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
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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

/**
 * The safe-area override only exists in the Ionic theme,
 * where the select modal is a centered dialog on phones.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select-modal: safe-area'), () => {
    test('centered select modal should not have extra top padding with non-zero safe-area-top', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-select label="Fruit" interface="modal">
            <ion-select-option value="apples">Apples</ion-select-option>
            <ion-select-option value="bananas">Bananas</ion-select-option>
          </ion-select>
        </ion-app>
        `,
        config
      );

      await page.evaluate(() => {
        document.documentElement.style.setProperty('--ion-safe-area-top', '80px');
      });

      const ionModalWillPresent = await page.spyOnEvent('ionModalWillPresent');
      const select = page.locator('ion-select');
      await select.click();
      await ionModalWillPresent.next();

      const toolbar = page.locator('ion-modal ion-header ion-toolbar');
      const paddingTop = await toolbar.evaluate((el) => getComputedStyle(el).paddingTop);

      expect(paddingTop).toBe('0px');
    });

    test('fullscreen modal with ion-select-modal should keep safe-area-top padding', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-modal>
            <ion-select-modal></ion-select-modal>
          </ion-modal>
          <script>
            const selectModal = document.querySelector('ion-select-modal');
            selectModal.options = ${JSON.stringify(checkedOptions)};
            selectModal.multiple = false;
          </script>
        </ion-app>
        `,
        config
      );

      await page.evaluate(() => {
        document.documentElement.style.setProperty('--ion-safe-area-top', '80px');
      });

      const ionModalWillPresent = await page.spyOnEvent('ionModalWillPresent');
      const modal = page.locator('ion-modal');
      await modal.evaluate((el: HTMLIonModalElement) => el.present());
      await ionModalWillPresent.next();

      const toolbar = page.locator('ion-modal ion-header ion-toolbar');
      const paddingTop = await toolbar.evaluate((el) => getComputedStyle(el).paddingTop);

      expect(paddingTop).toBe('80px');
    });
  });
});
