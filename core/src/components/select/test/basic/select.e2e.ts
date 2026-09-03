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

      test('it should focus the second option when opened with a value', async ({ page }) => {
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

      test('it should focus the second option when opened with a value', async ({ page, skip }) => {
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

      test('opening a popover with Enter should not immediately dismiss it', async ({ page, skip }, testInfo) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
        await page.keyboard.press('Enter');
        await ionPopoverDidPresent.next();

        const popover = page.locator('ion-popover');
        await expect(popover).toBeVisible();

        await page.waitForChanges();
        expect(ionPopoverDidDismiss).toHaveReceivedEventTimes(0);
        await expect(popover).toBeVisible();
      });

      test('holding Enter to open a popover should not immediately dismiss it', async ({ page, skip }, testInfo) => {
        // TODO (ROU-5437)
        skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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

        const modal = page.locator('ion-modal');

        // select has no value, so first option should be focused by default
        const modalOption1 = modal.locator('.select-interface-option:first-of-type ion-radio');
        await expect(modalOption1).toBeFocused();

        await expect(modal).toBeVisible();
      });

      test('it should focus the second option when opened with a value', async ({ page }) => {
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
        <ion-select label="Fruit" interface="alert">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const select = page.locator('label.select-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await select.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the select and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-select');
    });

    test('should trigger onclick only once when clicking the wrapper', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });
      // Create a spy function in page context
      await page.setContent(
        `
        <ion-select label="Fruit" label-placement="floating" interface="alert">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const select = page.locator('div.native-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await select.click({
        position: {
          x: 1,
          y: 1,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the select and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-select');
    });

    test('should trigger onclick only once when the select is itself slotted', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-select slot="end" label="Fruit" interface="alert">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-item>
      `,
        config
      );

      const clickEvent = await page.spyOnEvent('click');

      await page.locator('label.select-wrapper').click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(clickEvent).toHaveReceivedEventTimes(1);
    });

    test('should propagate clicks from start slot button to parent', async ({ page }) => {
      await page.setContent(
        `
        <div id="parent" onclick="window.parentClicks = (window.parentClicks || 0) + 1">
          Parent Container
          <ion-select label="Fruit" value="apple">
            <ion-button slot="start" onclick="window.buttonClicks = (window.buttonClicks || 0) + 1">Icon</ion-button>
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </div>
      `,
        config
      );

      const button = page.locator('ion-button[slot="start"]');
      const parent = page.locator('#parent');

      // Click the button in the start slot
      await button.click();

      // The button's own click handler should have fired
      let buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);

      // The parent's click handler should also have fired
      let parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(1);

      // Click on the parent container (far right to avoid the start button)
      await parent.click({ position: { x: 250, y: 50 } });

      // Parent should have incremented
      parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(2);

      // Button should NOT have incremented
      buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);
    });

    test('should propagate clicks from end slot button to parent', async ({ page }) => {
      await page.setContent(
        `
        <div id="parent" onclick="window.parentClicks = (window.parentClicks || 0) + 1">
          Parent Container
          <ion-select label="Fruit" value="apple">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
            <ion-button slot="end" onclick="window.buttonClicks = (window.buttonClicks || 0) + 1">Toggle</ion-button>
          </ion-select>
        </div>
      `,
        config
      );

      const button = page.locator('ion-button[slot="end"]');
      const parent = page.locator('#parent');

      // Click the button in the end slot
      await button.click();

      // The button's own click handler should have fired
      let buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);

      // The parent's click handler should also have fired
      let parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(1);

      // Click on the parent container (far left to avoid the end button)
      await parent.click({ position: { x: 10, y: 50 } });

      // Parent should have incremented
      parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(2);

      // Button should NOT have incremented
      buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);
    });
  });
});

/**
 * The solid and outline fills are only supported by `md` mode. These
 * are the only fills that get padding which can cause a double click.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: click'), () => {
    ['solid', 'outline'].forEach((fill) => {
      test(`should trigger onclick only once when clicking the ${fill} wrapper padding`, async ({ page }) => {
        await page.setContent(
          `
          <ion-select
            label="Fruit"
            label-placement="floating"
            value="apple"
            fill="${fill}"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        `,
          config
        );

        const clickEvent = await page.spyOnEvent('click');
        const wrapper = page.locator('label.select-wrapper');

        await wrapper.click({
          position: {
            x: 5,
            y: 5,
          },
        });

        expect(clickEvent).toHaveReceivedEventTimes(1);

        const event = clickEvent.events[0];
        expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-select');
      });
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

    test('should fire ionChange when confirming a popover value with Enter', async ({ page, skip }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Enter');

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
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Space');

      await ionChange.next();
      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(popover).not.toBeVisible();
    });

    test('should not fire ionChange when confirming the already-selected popover option with Enter', async ({
      page,
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Enter');

      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(popover).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should not fire ionChange when confirming the already-selected popover option with Space', async ({
      page,
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Space');

      await ionPopoverDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(popover).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should fire ionChange exactly once when confirming a modal value with Enter', async ({
      page,
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Enter');

      await ionChange.next();
      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(modal).not.toBeVisible();
    });

    test('should fire ionChange exactly once when confirming a modal value with Space', async ({
      page,
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Space');

      await ionChange.next();
      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventDetail({ value: 'banana' });
      expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(modal).not.toBeVisible();
    });

    test('should not fire ionChange when confirming the already-selected modal option with Enter', async ({
      page,
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Enter');

      await ionModalDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(modal).not.toBeVisible();
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should not fire ionChange when confirming the already-selected modal option with Space', async ({
      page,
      skip,
    }, testInfo) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
      await page.keyboard.press('Space');

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

    test('should not fire ionChange when confirming the already-selected alert option', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="alert" value="apple">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');

      await confirmButton.click();
      await ionAlertDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(select).toHaveJSProperty('value', 'apple');
    });

    test('should not fire ionChange when confirming the already-selected alert options (multiple)', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="alert" multiple="true">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select') as E2ELocator;
      await select.evaluate((el: HTMLIonSelectElement) => (el.value = ['apple', 'banana']));

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');

      await confirmButton.click();
      await ionAlertDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
    });

    test('should not fire ionChange when tapping the already-selected action-sheet option', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26789',
      });

      await page.setContent(
        `
        <ion-select aria-label="Fruit" interface="action-sheet" value="apple">
          <ion-select-option value="apple">Apple</ion-select-option>
          <ion-select-option value="banana">Banana</ion-select-option>
        </ion-select>
      `,
        config
      );

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');
      const select = page.locator('ion-select') as E2ELocator;
      const ionChange = await select.spyOnEvent('ionChange');

      await select.click();
      await ionActionSheetDidPresent.next();

      const actionSheet = page.locator('ion-action-sheet');
      const selectedButton = actionSheet.locator('.action-sheet-button[aria-checked="true"]');

      await selectedButton.click();
      await ionActionSheetDidDismiss.next();

      expect(ionChange).toHaveReceivedEventTimes(0);
      await expect(select).toHaveJSProperty('value', 'apple');
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

/**
 * This behavior does not vary across directions/modes
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: slotted click'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-select label="Fruit" interface="alert">
          <ion-icon id="start-icon" slot="start" name="pizza" aria-hidden="true"></ion-icon>
          <ion-button id="end-button" slot="end" aria-label="Clear selection">
            <ion-icon slot="icon-only" name="trash" aria-hidden="true"></ion-icon>
          </ion-button>
          <input id="end-checkbox" slot="end" type="checkbox" aria-label="Favorite" />
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `,
        config
      );
    });

    test('should emit one click when a slotted icon is clicked', async ({ page }) => {
      const clickEvent = await page.spyOnEvent('click');

      await page.locator('#start-icon').click();

      expect(clickEvent).toHaveReceivedEventTimes(1);

      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-icon');
    });

    /**
     * Decorative slotted content behaves the same as clicking the select
     * itself, so it opens the overlay.
     */
    test('should open when a slotted icon is clicked', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await page.locator('#start-icon').click();
      await ionAlertDidPresent.next();

      await expect(page.locator('ion-alert')).toBeVisible();
    });

    test('should emit one click when a slotted button is clicked', async ({ page }) => {
      const clickEvent = await page.spyOnEvent('click');

      await page.locator('#end-button').click();

      expect(clickEvent).toHaveReceivedEventTimes(1);
    });

    test('should not open when a slotted button is clicked', async ({ page }) => {
      await page.locator('#end-button').click();

      await expect(page.locator('ion-alert')).toHaveCount(0);
    });

    test('should not focus the select when a slotted button is clicked', async ({ page }) => {
      await page.locator('#end-button').click();

      await expect(page.locator('ion-select')).not.toHaveClass(/has-focus/);
    });

    test('should activate slotted form controls', async ({ page }) => {
      const checkbox = page.locator('#end-checkbox');

      await checkbox.click();

      await expect(checkbox).toBeChecked();
    });

    test('should open when the select is clicked after slotted content', async ({ page }) => {
      /**
       * Clicking a slotted button does not produce a forwarded click for the
       * select to ignore, so the following click on the select itself must
       * still open it.
       */
      await page.locator('#end-button').click();

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await page.locator('ion-select').click({ position: { x: 5, y: 5 } });
      await ionAlertDidPresent.next();

      await expect(page.locator('ion-alert')).toBeVisible();
    });
  });
});
