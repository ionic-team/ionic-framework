import { expect } from '@playwright/test';
import type { E2ELocator } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

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

      test('it should not focus any option when opened with no value', async ({ page }) => {
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

        // Verify that no option has the ion-focused class
        const focusedOptions = alert.locator('.alert-radio-button.ion-focused');
        await expect(focusedOptions).toHaveCount(0);
      });

      test('it should not focus any option when opened with a value', async ({ page }) => {
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

        // Alert interface doesn't apply ion-focused class to selected options
        const focusedOptions = alert.locator('.alert-radio-button.ion-focused');
        await expect(focusedOptions).toHaveCount(0);
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

      test('it should not focus any option when opened with no value', async ({ page }) => {
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

        // Verify that none of the options have the ion-focused class
        const focusedOptions = actionSheet.locator('.action-sheet-button.ion-focused');
        await expect(focusedOptions).toHaveCount(0);
      });

      test('it should focus the second option when opened', async ({ page }) => {
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

        // Find the button containing "Bananas" and verify it has the ion-focused class
        const bananasOption = actionSheet.locator('.action-sheet-button:has-text("Bananas")');
        await expect(bananasOption).toHaveClass(/ion-focused/);
      });

      test('it should focus the second option when opened with a header', async ({ page }) => {
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

        // Find the option containing "Bananas" and verify it has the ion-focused class
        const bananasOption = actionSheet.locator('.action-sheet-button:has-text("Bananas")');
        await expect(bananasOption).toHaveClass(/ion-focused/);
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

      test('it should focus the second option when value is set', async ({ page, skip }) => {
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

        const select = page.locator('ion-select');
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await select.click();
        await ionPopoverDidPresent.next();

        await page.waitForChanges();

        const popover = page.locator('ion-popover');

        // Find the option containing "Bananas" and verify it has the ion-focused class
        const bananasOption = popover.locator('.select-interface-option:has-text("Bananas")');
        await expect(bananasOption).toHaveClass(/ion-focused/);
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

      test('it should focus the second option when value is set', async ({ page }) => {
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

        // Find the option containing "Bananas" and verify it has the ion-focused class
        const bananasOption = modal.locator('.select-interface-option:has-text("Bananas")');
        await expect(bananasOption).toHaveClass(/ion-focused/);
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
