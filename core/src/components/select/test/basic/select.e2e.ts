import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2ELocator } from '@utils/test/playwright';

/**
 * This checks that certain overlays open correctly. While the
 * overlay rendering varies across directions, the select behavior
 * does not. The overlay rendering is already tested in the respective
 * test files.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
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
    });

    test.describe('select: popover', () => {
      test('it should open a popover select', async ({ page, skip }) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await page.click('#customPopoverSelect');

        await ionPopoverDidPresent.next();

        const popover = page.locator('ion-popover');

        // select has no value, so first option should be focused by default
        const popoverOption1 = popover.locator('.select-interface-option:first-of-type ion-radio');
        await expect(popoverOption1).toBeFocused();

        await expect(popover).toBeVisible();
      });

      test('it should scroll to selected option when opened', async ({ page }) => {
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await page.click('#popover-select-scroll-to-selected');
        await ionPopoverDidPresent.next();

        const popover = page.locator('ion-popover');
        await expect(popover).toHaveScreenshot(screenshot(`select-basic-popover-scroll-to-selected`));
      });
    });

    test.describe('select: modal', () => {
      test('it should open a modal select', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#customModalSelect');

        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');

        // select has no value, so first option should be focused by default
        const modalOption1 = modal.locator('.select-interface-option:first-of-type ion-radio');
        await expect(modalOption1).toBeFocused();

        await expect(modal).toBeVisible();
      });

      test('it should scroll to selected option when opened', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#modal-select-scroll-to-selected');
        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');
        await expect(modal).toHaveScreenshot(screenshot(`select-basic-modal-scroll-to-selected`));
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

    test('clicking padded space within item should click the select', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-select label="Fruit" interface="action-sheet">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-item>
      `,
        config
      );
      const itemNative = page.locator('.item-native');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      // Clicks the padded space within the item
      await itemNative.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await ionActionSheetDidPresent.next();

      expect(ionActionSheetDidPresent).toHaveReceivedEvent();
    });
  });
});
