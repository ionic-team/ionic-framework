import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: rich content options'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/select/test/rich-content-option', config);
    });

    test('it should render for alert interface and single selection', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

      const select = page.locator('#alert-select');

      await select.click();

      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const firstOption = alert.locator('.alert-radio-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      // Confirm the selection
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');
      await confirmButton.click();

      await ionAlertDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render for alert interface and multiple selection', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

      const select = page.locator('#alert-select-multiple');

      await select.click();

      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const firstOption = alert.locator('.alert-checkbox-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      // Confirm the selection
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');
      await confirmButton.click();

      await ionAlertDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render for action sheet interface', async ({ page }) => {
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      const select = page.locator('#action-sheet-select');

      await select.click();

      await ionActionSheetDidPresent.next();

      const actionSheet = page.locator('ion-action-sheet');
      const firstOption = actionSheet.locator('.action-sheet-button-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      await ionActionSheetDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render for popover interface and single selection', async ({ page }) => {
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

      const select = page.locator('#popover-select');

      await select.click();

      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const firstOption = popover.locator('.select-option-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      await ionPopoverDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render for popover interface and multiple selection', async ({ page }) => {
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

      const select = page.locator('#popover-select-multiple');

      await select.click();

      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');
      const firstOption = popover.locator('.select-option-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      // Confirm the selection
      const backdrop = page.locator('ion-backdrop');
      await backdrop.click({ position: { x: 10, y: 10 } });

      await ionPopoverDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render for modal interface and single selection', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      const select = page.locator('#modal-select');

      await select.click();

      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const firstOption = modal.locator('.select-option-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      await ionModalDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render for modal interface and multiple selection', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      const select = page.locator('#modal-select-multiple');

      await select.click();

      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const firstOption = modal.locator('.select-option-label').first();
      const avatar = firstOption.locator('ion-avatar');
      const spanText = await firstOption.locator('.span-style').textContent();
      const firstOptionText = 'Full Content';

      await expect(firstOption).toContainText(firstOptionText);
      await expect(avatar).toBeVisible();

      // Click on the first option
      await firstOption.click();

      // Confirm the selection
      const cancelButton = modal.getByRole('button', { name: 'Cancel' });

      await cancelButton.click();
      await ionModalDidDismiss.next();

      // Verify that the select text includes the option text
      const selectText = await select.locator('.select-text').textContent();

      expect(selectText).toContain(firstOptionText);
      expect(selectText).toContain(spanText);

      // Verify that the select text does not include the avatar and badge
      const selectTextAvatar = select.locator('.select-text ion-avatar');
      const selectTextBadge = select.locator('.select-text ion-badge');

      await expect(selectTextAvatar).toHaveCount(0);
      await expect(selectTextBadge).toHaveCount(0);
    });

    test('it should render the aria label as plain text', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

      const select = page.locator('#alert-select');

      await select.click();

      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const firstOption = alert.locator('.alert-radio-label').first();

      // Click on the first option
      await firstOption.click();

      // Confirm the selection
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');
      await confirmButton.click();

      await ionAlertDidDismiss.next();

      const nativeButton = select.locator('button');
      const ariaLabel = await nativeButton.getAttribute('aria-label');

      expect(ariaLabel).toContain('Full Content This is a span element');
    });
  });
});

/**
 * This behavior does not vary across modes
 */
configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('select: rich content options'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/select/test/rich-content-option', config);
    });

    test('it should render slots in the correct places', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      const select = page.locator('#alert-select');

      await select.click();

      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const firstOption = alert.locator('.alert-radio-label').first();
      const startContainer = firstOption.locator('.select-option-start');
      const endContainer = firstOption.locator('.select-option-end');

      const avatar = startContainer.locator('ion-avatar');
      const badge = endContainer.locator('ion-badge');

      await expect(avatar).toBeVisible();
      await expect(badge).toBeVisible();

      const isRTL = await page.evaluate(() => document.dir === 'rtl');
      const optionBox = await firstOption.boundingBox();
      const startBox = await startContainer.boundingBox();
      const endBox = await endContainer.boundingBox();
      const optionMidpointX = optionBox!.x + optionBox!.width / 2;

      if (isRTL) {
        // Verify the start container is rendered on the right,
        // and the end container is rendered on the left
        expect(startBox!.x).toBeGreaterThan(optionMidpointX);
        expect(endBox!.x).toBeLessThan(optionMidpointX);
      } else {
        // Verify the start container is rendered on the left,
        // and the end container is rendered on the right
        expect(startBox!.x).toBeLessThan(optionMidpointX);
        expect(endBox!.x).toBeGreaterThan(optionMidpointX);
      }
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: rich content options'), () => {
    test('it should only render text nodes when `innerHTMLTemplatesEnabled` is disabled', async ({ page }) => {
      await page.setContent(
        `
          <ion-select id="alert-select" label="Alert" placeholder="Select one" interface="alert">
            <ion-select-option value="full" description="Choose me!">
              <ion-badge slot="end">NEW</ion-badge>
              <ion-avatar id="avatar" slot="start" size="large">
                <img src="/src/components/avatar/test/avatar.svg" />
              </ion-avatar>
              Full Content
              <span class="span-style">This is a span element</span>
            </ion-select-option>
          </ion-select>
        `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

      const select = page.locator('#alert-select');

      await select.click();

      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      const firstOption = alert.locator('.alert-radio-label').first();
      const startContainer = firstOption.locator('.select-option-start');
      const endContainer = firstOption.locator('.select-option-end');
      const span = firstOption.locator('.span-style');

      await expect(startContainer).toHaveCount(0);
      await expect(endContainer).toHaveCount(0);
      await expect(span).toHaveCount(0);

      // Click on the first option
      await firstOption.click();

      // Confirm the selection
      const confirmButton = alert.locator('.alert-button:not(.alert-button-role-cancel)');
      await confirmButton.click();

      await ionAlertDidDismiss.next();

      const selectText = select.locator('.select-text');
      const selectTextSpan = selectText.locator('.span-style');

      await expect(selectTextSpan).toHaveCount(0);
    });
  });
});
