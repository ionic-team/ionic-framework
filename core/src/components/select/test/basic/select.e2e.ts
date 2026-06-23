import { expect } from '@playwright/test';
import type { E2ELocator } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * This checks that certain overlays open correctly. While the
 * overlay rendering varies across directions, the select behavior
 * does not. The overlay rendering is already tested in the respective
 * test files.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('select: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/select/test/basic', config);
    });

    test.describe('select: alert', () => {
      test('it should open an alert select', async ({ page }) => {
        const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

        await page.click('#customAlertSelect');

        await ionAlertDidPresent.next();

        await expect(page.locator('ion-alert')).toBeVisible();
      });

      test('it should scroll to selected option when opened', async ({ page }) => {
        const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

        await page.click('#alert-select-scroll-to-selected');
        await ionAlertDidPresent.next();

        const alert = page.locator('ion-alert');
        await expect(alert).toHaveScreenshot(screenshot(`select-basic-alert-scroll-to-selected`));
      });

      // On open, the alert focuses its wrapper (mirroring the native alert
      // behavior) rather than an option, so no option is focused or shows the
      // focus ring. Tabbing then moves focus into the radio group, focusing
      // the first option and showing the focus ring.
      test('it should focus the wrapper on open, then the first option on Tab', async ({ page, pageUtils }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="alert">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

        await select.click();
        await ionAlertDidPresent.next();

        await page.waitForChanges();

        const alert = page.locator('ion-alert');

        // On open the wrapper is focused and no option has the focus ring.
        await expect(alert.locator('.alert-wrapper')).toBeFocused();
        await expect(alert.locator('.alert-radio-button.ion-focused')).toHaveCount(0);

        // Tabbing moves focus into the radio group, focusing the first option
        // and showing the focus ring.
        await pageUtils.pressKeys('Tab');
        await page.waitForChanges();

        const firstOption = alert.locator('.alert-radio-button').nth(0);
        await expect(firstOption).toBeFocused();
        await expect(firstOption).toHaveClass(/ion-focused/);
      });

      // Same as above, but with a selected value: the wrapper is focused on
      // open and tabbing focuses the selected option (the roving tabindex
      // points at the checked radio) rather than the first option.
      test('it should focus the wrapper on open, then the selected option on Tab', async ({ page, pageUtils }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="alert" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

        await select.click();
        await ionAlertDidPresent.next();

        await page.waitForChanges();

        const alert = page.locator('ion-alert');

        // On open the wrapper is focused and no option has the focus ring.
        await expect(alert.locator('.alert-wrapper')).toBeFocused();
        await expect(alert.locator('.alert-radio-button.ion-focused')).toHaveCount(0);

        // Tabbing moves focus to the selected option and shows the focus ring.
        await pageUtils.pressKeys('Tab');
        await page.waitForChanges();

        const selectedOption = alert.locator('.alert-radio-button').nth(1);
        await expect(selectedOption).toBeFocused();
        await expect(selectedOption).toHaveClass(/ion-focused/);
      });

      // When opening with the keyboard (Tab to the select, then Enter), the
      // focus indicator should display on the alert wrapper.
      test('it should show the focus indicator when opened with the keyboard', async ({ page, pageUtils, skip }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="alert">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionAlertDidPresent.next();

        await page.waitForChanges();

        const alert = page.locator('ion-alert');

        // The wrapper should have :focus-visible, and no option should
        // have the .ion-focused class.
        const wrapper = alert.locator('.alert-wrapper');
        await expect(wrapper).toBeFocused();
        expect(await wrapper.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
        await expect(alert.locator('.alert-radio-button.ion-focused')).toHaveCount(0);
      });

      // When opening with the keyboard and a value, the focus indicator
      // still displays on the wrapper, not the selected option.
      test('it should focus the wrapper when opened with the keyboard and a value', async ({
        page,
        pageUtils,
        skip,
      }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="alert" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionAlertDidPresent.next();

        await page.waitForChanges();

        const alert = page.locator('ion-alert');

        // The wrapper (not the selected option) has :focus-visible, and no
        // option has the .ion-focused class.
        const wrapper = alert.locator('.alert-wrapper');
        await expect(wrapper).toBeFocused();
        expect(await wrapper.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
        await expect(alert.locator('.alert-radio-button.ion-focused')).toHaveCount(0);
      });
    });

    test.describe('select: action sheet', () => {
      test('it should open an action sheet select', async ({ page }) => {
        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        await page.click('#customActionSheetSelect');

        await ionActionSheetDidPresent.next();

        await expect(page.locator('ion-action-sheet')).toBeVisible();
      });

      test('it should scroll to selected option when opened', async ({ page }) => {
        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        await page.click('#action-sheet-select-scroll-to-selected');
        await ionActionSheetDidPresent.next();

        const actionSheet = page.locator('ion-action-sheet');
        await expect(actionSheet).toHaveScreenshot(screenshot(`select-basic-action-sheet-scroll-to-selected`));
      });

      // On open, the action sheet focuses its dialog rather than an option,
      // so no option is focused or shows the focus ring. Tabbing then moves
      // focus to the first option and shows the focus ring.
      test('it should focus the dialog on open, then the first option on Tab', async ({ page, pageUtils }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="action-sheet">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        await select.click();
        await ionActionSheetDidPresent.next();

        await page.waitForChanges();

        const actionSheet = page.locator('ion-action-sheet');

        // On open the dialog is focused and no option has the focus ring.
        await expect(actionSheet).toBeFocused();
        await expect(actionSheet.locator('.action-sheet-button.ion-focused')).toHaveCount(0);

        // Tabbing moves focus to the first option and shows the focus ring.
        await pageUtils.pressKeys('Tab');
        await page.waitForChanges();

        const firstOption = actionSheet.locator('.action-sheet-button').nth(0);
        await expect(firstOption).toBeFocused();
        await expect(firstOption).toHaveClass(/ion-focused/);
      });

      // Same as above, but with a selected value: the selected option is
      // focused on open and tabbing moves focus to the Cancel button.
      test('it should focus the selected option on open, then the Cancel button on Tab', async ({
        page,
        pageUtils,
      }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="action-sheet" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        await select.click();
        await ionActionSheetDidPresent.next();

        await page.waitForChanges();

        const actionSheet = page.locator('ion-action-sheet');

        // On open the selected option is focused and no option has the focus ring.
        const bananasOption = actionSheet.locator('.action-sheet-button:has-text("Bananas")');
        await expect(bananasOption).toBeFocused();
        await expect(actionSheet.locator('.action-sheet-button.ion-focused')).toHaveCount(0);

        // Tabbing moves focus to the Cancel button and shows the focus ring.
        await pageUtils.pressKeys('Tab');
        await page.waitForChanges();
        const cancelButton = actionSheet.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeFocused();
        await expect(cancelButton).toHaveClass(/ion-focused/);
      });

      test('it should focus the second option when opened with a value and a header', async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/30480',
        });

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="action-sheet" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        await select.evaluate((el: HTMLIonSelectElement) => {
          el.interfaceOptions = {
            header: 'Header',
          };
        });

        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        await select.click();
        await ionActionSheetDidPresent.next();

        await page.waitForChanges();

        const actionSheet = page.locator('ion-action-sheet');

        // Find the option containing "Bananas" and verify it has focus
        // so screen readers announce it
        const bananasOption = actionSheet.locator('.action-sheet-button:has-text("Bananas")');
        await expect(bananasOption).toBeFocused();

        // Verify the focus indicator is not shown when the action sheet
        // first opens.
        await expect(actionSheet.locator('.action-sheet-button.ion-focused')).toHaveCount(0);
      });

      // When opening with the keyboard (Tab to the select, then Enter), no
      // focus indicator should display on the action sheet, but we still
      // need to ensure the dialog is focused.
      test('it should add the focused class when opened with the keyboard', async ({ page, pageUtils, skip }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="action-sheet">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionActionSheetDidPresent.next();

        await page.waitForChanges();

        const actionSheet = page.locator('ion-action-sheet');

        // The action sheet should have :focus-visible, and no option should
        // have the .ion-focused class.
        await expect(actionSheet).toBeFocused();
        expect(await actionSheet.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
        await expect(actionSheet.locator('.action-sheet-button.ion-focused')).toHaveCount(0);
      });

      // When opening with the keyboard and a value, the focus indicator
      // should display on the selected option.
      test('it should focus the selected option when opened with the keyboard and a value', async ({
        page,
        pageUtils,
        skip,
      }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="action-sheet" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionActionSheetDidPresent.next();

        await page.waitForChanges();

        const actionSheet = page.locator('ion-action-sheet');

        // The selected option (Bananas) is focused and shows the focus ring.
        const bananasOption = actionSheet.locator('.action-sheet-button:has-text("Bananas")');
        await expect(bananasOption).toBeFocused();
        await expect(bananasOption).toHaveClass(/ion-focused/);
      });
    });

    test.describe('select: popover', () => {
      test('it should open a popover select', async ({ page }) => {
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await page.click('#customPopoverSelect');

        await ionPopoverDidPresent.next();

        await expect(page.locator('ion-popover')).toBeVisible();
      });

      // On open, the popover focuses the first option (so screen readers
      // announce it) rather than the dialog, but no option shows the focus
      // ring. Arrowing then moves focus to the next option and shows the focus
      // ring.
      test('it should focus the first option on open, then the next option on Arrow', async ({ page, pageUtils }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="popover">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await select.click();
        await ionPopoverDidPresent.next();

        await page.waitForChanges();

        const popover = page.locator('ion-popover');

        // On open the first option is focused and no option has the focus ring.
        await expect(popover.locator('.select-interface-option').nth(0).locator('ion-radio')).toBeFocused();
        await expect(popover.locator('.select-interface-option.ion-focused')).toHaveCount(0);

        // Arrowing moves focus to the next option and shows the focus ring.
        await pageUtils.pressKeys('ArrowDown');
        await page.waitForChanges();

        const secondOption = popover.locator('.select-interface-option').nth(1);
        await expect(secondOption.locator('ion-radio')).toBeFocused();
        await expect(secondOption).toHaveClass(/ion-focused/);
      });

      // Same as above, but with a selected value: the popover focuses the
      // selected option (so screen readers announce it), but no option
      // shows the focus ring. Arrowing then moves focus to the next option
      // and shows the focus ring.
      test('it should focus the selected option on open, then the next option on Arrow', async ({
        page,
        pageUtils,
      }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="popover" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await select.click();
        await ionPopoverDidPresent.next();

        await page.waitForChanges();

        const popover = page.locator('ion-popover');

        // On open the selected option is focused and no option has the focus ring.
        const bananasOption = popover.locator('.select-interface-option:has-text("Bananas")');
        await expect(bananasOption.locator('ion-radio')).toBeFocused();
        await expect(popover.locator('.select-interface-option.ion-focused')).toHaveCount(0);

        // Arrowing moves focus to the next option and shows the focus ring.
        await pageUtils.pressKeys('ArrowDown');
        await page.waitForChanges();

        const orangesOption = popover.locator('.select-interface-option:has-text("Oranges")');
        await expect(orangesOption.locator('ion-radio')).toBeFocused();
        await expect(orangesOption).toHaveClass(/ion-focused/);
      });

      // When opening with the keyboard (Tab to the select, then Enter), the
      // focus indicator should display on the focused option.
      test('it should show the focus indicator when opened with the keyboard', async ({ page, pageUtils, skip }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="popover">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionPopoverDidPresent.next();

        await page.waitForChanges();

        const popover = page.locator('ion-popover');

        // The focus indicator should be shown on the focused option.
        await expect(popover.locator('.select-interface-option').nth(0)).toHaveClass(/ion-focused/);
      });

      // When opening with the keyboard and a value, the focus indicator
      // should display on the selected option.
      test('it should focus the selected option when opened with the keyboard and a value', async ({
        page,
        pageUtils,
        skip,
      }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="popover" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionPopoverDidPresent.next();

        await page.waitForChanges();

        const popover = page.locator('ion-popover');

        // The selected option (Bananas, the 2nd), not the first, is focused and
        // shows the focus ring.
        const firstOption = popover.locator('.select-interface-option').nth(0);
        const selectedOption = popover.locator('.select-interface-option').nth(1);
        await expect(selectedOption.locator('ion-radio')).toBeFocused();
        await expect(selectedOption).toHaveClass(/ion-focused/);
        await expect(firstOption).not.toHaveClass(/ion-focused/);
      });

      test('it should scroll to selected option when opened', async ({ page }) => {
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await page.click('#popover-select-scroll-to-selected');
        await ionPopoverDidPresent.next();

        const popover = page.locator('ion-popover');
        await expect(popover).toHaveScreenshot(screenshot(`select-basic-popover-scroll-to-selected`));
      });

      test('opening a popover with Enter should not immediately dismiss it', async ({ page, pageUtils }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
        });

        await page.setContent(
          `
          <ion-app>
            <ion-select aria-label="Fruit" interface="popover">
              <ion-select-option value="apple">Apple</ion-select-option>
              <ion-select-option value="banana">Banana</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
        const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

        await page.locator('ion-select button').focus();
        await pageUtils.pressKeys('Enter');
        await ionPopoverDidPresent.next();

        const popover = page.locator('ion-popover');
        await expect(popover).toBeVisible();

        await page.waitForChanges();
        expect(ionPopoverDidDismiss).toHaveReceivedEventTimes(0);
        await expect(popover).toBeVisible();
      });

      test('holding Enter to open a popover should not immediately dismiss it', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
        });

        await page.setContent(
          `
          <ion-app>
            <ion-select aria-label="Fruit" interface="popover">
              <ion-select-option value="apple">Apple</ion-select-option>
              <ion-select-option value="banana">Banana</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
        const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
        const select = page.locator('ion-select') as E2ELocator;
        const ionChange = await select.spyOnEvent('ionChange');

        await page.locator('ion-select button').focus();
        await page.keyboard.down('Enter');
        await ionPopoverDidPresent.next();

        const popover = page.locator('ion-popover');
        await expect(popover).toBeVisible();

        // Second down('Enter') fires a repeat keydown (repeat=true),
        // which is the path guarded against in radio-group.
        await page.keyboard.down('Enter');
        await page.keyboard.up('Enter');
        await page.waitForChanges();

        expect(ionPopoverDidDismiss).toHaveReceivedEventTimes(0);
        expect(ionChange).toHaveReceivedEventTimes(0);
        await expect(popover).toBeVisible();
      });
    });

    test.describe('select: modal', () => {
      test('it should open a modal select', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#customModalSelect');

        await ionModalDidPresent.next();

        await expect(page.locator('ion-modal')).toBeVisible();
      });

      // On open, the modal focuses the first option (so screen readers
      // announce it) rather than the dialog, but no option shows the focus
      // ring. Arrowing then moves focus to the next option and shows the
      // focus ring.
      test('it should focus the first option on open, then the next option on Arrow', async ({ page, pageUtils }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="modal">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await select.click();
        await ionModalDidPresent.next();

        await page.waitForChanges();

        const modal = page.locator('ion-modal');

        // On open the first option is focused and no option has the focus ring.
        await expect(modal.locator('.select-interface-option').nth(0).locator('ion-radio')).toBeFocused();
        await expect(modal.locator('.select-interface-option.ion-focused')).toHaveCount(0);

        // Arrowing moves focus to the next option and shows the focus ring.
        await pageUtils.pressKeys('ArrowDown');
        await page.waitForChanges();

        const secondOption = modal.locator('.select-interface-option').nth(1);
        await expect(secondOption.locator('ion-radio')).toBeFocused();
        await expect(secondOption).toHaveClass(/ion-focused/);
      });

      // Same as above, but with a selected value: the modal focuses the
      // selected option (so screen readers announce it), but no option shows
      // the focus ring. Arrowing then moves focus to the next option and
      // shows the focus ring.
      test('it should focus the selected option on open, then the next option on Arrow', async ({
        page,
        pageUtils,
      }) => {
        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="modal" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const select = page.locator('ion-select');
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await select.click();
        await ionModalDidPresent.next();

        await page.waitForChanges();

        const modal = page.locator('ion-modal');

        // On open the selected option is focused and no option has the focus ring.
        const bananasOption = modal.locator('.select-interface-option:has-text("Bananas")');
        await expect(bananasOption.locator('ion-radio')).toBeFocused();
        await expect(modal.locator('.select-interface-option.ion-focused')).toHaveCount(0);

        // Arrowing moves focus to the next option and shows the focus ring.
        await pageUtils.pressKeys('ArrowDown');
        await page.waitForChanges();

        const orangesOption = modal.locator('.select-interface-option:has-text("Oranges")');
        await expect(orangesOption.locator('ion-radio')).toBeFocused();
        await expect(orangesOption).toHaveClass(/ion-focused/);
      });

      // When opening with the keyboard (Tab to the select, then Enter), the
      // focus indicator should display on the focused option.
      test('it should show the focus indicator when opened with the keyboard', async ({ page, pageUtils, skip }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="modal">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionModalDidPresent.next();

        await page.waitForChanges();

        const modal = page.locator('ion-modal');

        // The focus indicator should be shown on the focused option.
        await expect(modal.locator('.select-interface-option').nth(0)).toHaveClass(/ion-focused/);
      });

      // When opening with the keyboard and a value, the focus indicator
      // should display on the selected option.
      test('it should focus the selected option when opened with the keyboard and a value', async ({
        page,
        pageUtils,
        skip,
      }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        // ion-app is required to apply the focused styles
        await page.setContent(
          `
          <ion-app>
            <ion-select label="Fruit" interface="modal" value="bananas">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-app>
        `,
          config
        );

        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        // Tab to the select and open it with the keyboard.
        await pageUtils.pressKeys('Tab');
        await pageUtils.pressKeys('Enter');
        await ionModalDidPresent.next();

        await page.waitForChanges();

        const modal = page.locator('ion-modal');

        // The selected option (Bananas, the 2nd), not the first, is focused and
        // shows the focus ring.
        const firstOption = modal.locator('.select-interface-option').nth(0);
        const selectedOption = modal.locator('.select-interface-option').nth(1);
        await expect(selectedOption.locator('ion-radio')).toBeFocused();
        await expect(selectedOption).toHaveClass(/ion-focused/);
        await expect(firstOption).not.toHaveClass(/ion-focused/);
      });

      test('it should scroll to selected option when opened', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#modal-select-scroll-to-selected');
        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');
        await expect(modal).toHaveScreenshot(screenshot(`select-basic-modal-scroll-to-selected`));
      });

      test('it should support keyboard focus cycling between list, handle, and cancel', async ({ page, pageUtils }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#customModalSelect');
        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');
        const firstOption = modal.locator('.select-interface-option:first-of-type ion-radio');
        const secondOption = modal.locator('.select-interface-option:nth-of-type(2) ion-radio');
        const handle = modal.locator('.modal-handle');
        const cancelButton = modal.getByRole('button', { name: 'Cancel' });

        await expect(firstOption).toBeFocused();

        // After moving focus with arrow keys, Tab should still visit the handle
        // before the cancel button
        await pageUtils.pressKeys('ArrowDown');
        await expect(secondOption).toBeFocused();
        await page.waitForChanges();
        await pageUtils.pressKeys('Tab');
        await expect(handle).toBeFocused();
        await pageUtils.pressKeys('Shift+Tab');
        await expect(secondOption).toBeFocused();

        await pageUtils.pressKeys('ArrowUp');
        await expect(firstOption).toBeFocused();

        // Forward cycle: list option -> handle -> cancel -> list option
        await pageUtils.pressKeys('Tab');
        await expect(handle).toBeFocused();

        await pageUtils.pressKeys('Tab');
        await expect(cancelButton).toBeFocused();

        await pageUtils.pressKeys('Tab');
        await expect(firstOption).toBeFocused();

        // Reverse cycle: list option -> cancel -> handle -> list option
        await pageUtils.pressKeys('Shift+Tab');
        await expect(cancelButton).toBeFocused();

        await pageUtils.pressKeys('Shift+Tab');
        await expect(handle).toBeFocused();

        await pageUtils.pressKeys('Shift+Tab');
        await expect(firstOption).toBeFocused();
      });

      test('it should tab through cancel using the last arrow-highlighted option', async ({ page, pageUtils }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#customModalSelect');
        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');
        const thirdOption = modal.locator('.select-interface-option:nth-of-type(3) ion-radio');
        const handle = modal.locator('.modal-handle');
        const cancelButton = modal.getByRole('button', { name: 'Cancel' });

        await pageUtils.pressKeys('ArrowDown');
        await pageUtils.pressKeys('ArrowDown');
        await expect(thirdOption).toBeFocused();
        await page.waitForChanges();

        await pageUtils.pressKeys('Tab');
        await expect(handle).toBeFocused();

        await pageUtils.pressKeys('Tab');
        await expect(cancelButton).toBeFocused();

        await pageUtils.pressKeys('Tab');
        await expect(thirdOption).toBeFocused();

        await pageUtils.pressKeys('Shift+Tab');
        await expect(cancelButton).toBeFocused();

        await pageUtils.pressKeys('Shift+Tab');
        await expect(handle).toBeFocused();

        await pageUtils.pressKeys('Shift+Tab');
        await expect(thirdOption).toBeFocused();
      });
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: multiple selects'), () => {
    test('should not open multiple alert windows when clicked multiple times', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25126',
      });

      await page.goto('/src/components/select/test/basic', config);

      const select = page.locator('#alert-select');

      await select.evaluate((el: HTMLIonSelectElement) => {
        /*
         * Playwright's click() method attempts to scroll to the handle
         * to perform the action. That is problematic when the overlay
         * is already visible. We manually click() the element instead
         * to avoid flaky tests.
         */
        /* eslint-disable custom-rules/await-playwright-promise-assertion */
        el.click();
        el.click();
        el.click();
        /* eslint-enable custom-rules/await-playwright-promise-assertion */
      });

      const alerts = await page.$$('ion-alert');

      expect(alerts.length).toBe(1);
    });
  });

  test.describe(title('select: click'), () => {
    test('should trigger onclick only once when clicking the label', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });
      // Create a spy function in page context
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="alert">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const input = page.locator('label.select-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await input.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the checkbox and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-select');
    });
  });
});

/**
 * ionChange has a consistent behavior across modes
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: ionChange'), () => {
    test('should fire ionChange when confirming a value from an alert', async ({ page }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="alert">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionChange = await page.spyOnEvent('ionChange');
      const select = page.locator('ion-select');

      await select.click();
      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const radioButtons = alert.locator('.alert-radio-button');
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');

      await radioButtons.nth(0).click();
      await confirmButton.click();

      await ionChange.next();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'apple' });
      expect(ionChange).toHaveReceivedEventTimes(1);
    });

    test('should fire ionChange when confirming a popover value with Enter', async ({ page, pageUtils }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="popover">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const secondRadio = popover.locator('ion-radio').nth(1);

      await secondRadio.focus();
      await pageUtils.pressKeys('Enter');

      await ionChange.next();
      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(popover).not.toBeVisible();
    });

    test('should fire ionChange when confirming a value from a popover', async ({ page }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="popover">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const radioButtons = popover.locator('ion-radio');

      await radioButtons.nth(0).click();

      await ionChange.next();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'apple' });
      expect(ionChange).toHaveReceivedEventTimes(1);
    });

    test('should fire ionChange exactly once when confirming a popover value with Space', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="popover">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const secondRadio = popover.locator('ion-radio').nth(1);

      await secondRadio.focus();
      await pageUtils.pressKeys('Space');

      await ionChange.next();
      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(popover).not.toBeVisible();
    });

    test('should not fire ionChange when confirming the already-selected popover option with Enter', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="popover" value="apple">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const selectedRadio = popover.locator('ion-radio').nth(0);

      await selectedRadio.focus();
      await pageUtils.pressKeys('Enter');

      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(popover).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should not fire ionChange when confirming the already-selected popover option with Space', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="popover" value="apple">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const selectedRadio = popover.locator('ion-radio').nth(0);

      await selectedRadio.focus();
      await pageUtils.pressKeys('Space');

      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(popover).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should fire ionChange exactly once when confirming a modal value with Enter', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="modal">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const secondRadio = modal.locator('ion-radio').nth(1);

      await secondRadio.focus();
      await pageUtils.pressKeys('Enter');

      await ionChange.next();
      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(modal).not.toBeVisible();
    });

    test('should fire ionChange exactly once when confirming a modal value with Space', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30561',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="modal">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const secondRadio = modal.locator('ion-radio').nth(1);

      await secondRadio.focus();
      await pageUtils.pressKeys('Space');

      await ionChange.next();
      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(modal).not.toBeVisible();
    });

    test('should not fire ionChange when confirming the already-selected modal option with Enter', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="modal" value="apple">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const selectedRadio = modal.locator('ion-radio').nth(0);

      await selectedRadio.focus();
      await pageUtils.pressKeys('Enter');

      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(modal).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should not fire ionChange when confirming the already-selected modal option with Space', async ({
      page,
      pageUtils,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-app>
          <ion-select aria-label="Fruit" interface="modal" value="apple">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-app>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const selectedRadio = modal.locator('ion-radio').nth(0);

      await selectedRadio.focus();
      await pageUtils.pressKeys('Space');

      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(modal).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should fire ionChange when confirming multiple values from a popover', async ({ page }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="popover" multiple="true">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const checkboxes = popover.locator('ion-checkbox');

      await checkboxes.nth(0).click();
      await ionChange.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: ['apple'] });
      expect(ionChange).toHaveReceivedEventTimes(1);

      await checkboxes.nth(1).click();
      await ionChange.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: ['apple', 'banana'] });
      expect(ionChange).toHaveReceivedEventTimes(2);
    });

    test('should fire ionChange when confirming a value from an action sheet', async ({ page }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="action-sheet">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionChange = await page.spyOnEvent('ionChange');
      const select = page.locator('ion-select');

      await select.click();
      await ionActionSheetDidPresent.next();

      const actionSheet = page.locator('ion-action-sheet');
      const buttons = actionSheet.locator('.action-sheet-button');

      await buttons.nth(0).click();

      await ionChange.next();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'apple' });
      expect(ionChange).toHaveReceivedEventTimes(1);
    });

    test('should not fire when programmatically setting a valid value', async ({ page }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const select = page.locator('ion-select');

      await select.evaluate((el: HTMLIonSelectElement) => (el.value = 'banana'));
      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });
});

/**
 * focus has a consistent behavior across modes
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: focus'), () => {
    test('should have the focus class when tabbing', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="alert">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select');

      await pageUtils.pressKeys('Tab');
      await expect(select).toHaveClass(/has-focus/);
    });

    test('should have the focus class after clicking to close', async ({ page }) => {
      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="alert">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');

      await select.click();
      await ionAlertDidPresent.next();

      await confirmButton.click();

      await expect(select).toHaveClass(/has-focus/);
    });
  });
});
