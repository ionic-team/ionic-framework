import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker: rendering'), () => {
    test('inline pickers should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker/test/basic`, config);

      const fullStack = page.locator('#inline ion-picker-column-option[data-test-value="full-stack"]');
      const onion = page.locator('#inline ion-picker-column-option[data-test-value="onion"]');

      await expect(fullStack).toHaveClass(/option-active/);
      await expect(onion).toHaveClass(/option-active/);

      await page.waitForChanges();

      await expect(page.locator('#inline')).toHaveScreenshot(screenshot(`picker-inline-diff`));
    });
  });

  test.describe(title('picker: overlay rendering'), () => {
    test('popover: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker/test/basic`, config);

      const button = page.locator('#popover');
      const didPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const picker = page.locator('ion-popover ion-picker');

      await button.click();
      await didPresent.next();

      await expect(picker).toBeVisible();

      const popoverContent = page.locator('ion-popover .ion-delegate-host');

      await expect(popoverContent).toHaveScreenshot(screenshot(`picker-popover-diff`), {
        /**
         * Animations must be enabled to capture the screenshot.
         * By default, animations are disabled with toHaveScreenshot,
         * and when capturing the screenshot will call animation.finish().
         * This will cause the popover to close and the screenshot capture
         * to be invalid.
         */
        animations: 'allow',
      });
    });

    test('modal: should not have visual regression', async ({ page }) => {
      await page.goto('/src/components/picker/test/basic', config);

      const button = page.locator('#modal');
      const didPresent = await page.spyOnEvent('ionModalDidPresent');
      const picker = page.locator('ion-modal ion-picker');

      await button.click();
      await didPresent.next();

      await expect(picker).toBeVisible();

      const modalContent = page.locator('ion-modal .ion-delegate-host');

      await expect(modalContent).toHaveScreenshot(screenshot(`picker-modal-diff`), {
        /**
         * Animations must be enabled to capture the screenshot.
         * By default, animations are disabled with toHaveScreenshot,
         * and when capturing the screenshot will call animation.finish().
         * This will cause the modal to close and the screenshot capture
         * to be invalid.
         */
        animations: 'allow',
      });
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker: focus'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="full-stack" id="first">
            <ion-picker-column-option value="minified">Minified</ion-picker-column-option>
            <ion-picker-column-option value="responsive">Responsive</ion-picker-column-option>
            <ion-picker-column-option value="full-stack">Full Stack</ion-picker-column-option>
            <ion-picker-column-option value="mobile-first">Mobile First</ion-picker-column-option>
            <ion-picker-column-option value="serverless">Serverless</ion-picker-column-option>
          </ion-picker-column>
          <ion-picker-column value="onion" id="second">
            <ion-picker-column-option value="tomato">Tomato</ion-picker-column-option>
            <ion-picker-column-option value="avocado">Avocado</ion-picker-column-option>
            <ion-picker-column-option value="onion">Onion</ion-picker-column-option>
            <ion-picker-column-option value="potato">Potato</ion-picker-column-option>
            <ion-picker-column-option value="artichoke">Artichoke</ion-picker-column-option>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );
    });

    test('tabbing should correctly move focus between columns', async ({ page }) => {
      const firstColumn = page.locator('ion-picker-column#first');
      const secondColumn = page.locator('ion-picker-column#second');

      // Focus first column
      await page.keyboard.press('Tab');
      await expect(firstColumn).toBeFocused();

      await page.waitForChanges();

      // Focus second column
      await page.keyboard.press('Tab');
      await expect(secondColumn).toBeFocused();
    });

    test('tabbing should correctly move focus back', async ({ page }) => {
      const firstColumn = page.locator('ion-picker-column#first');
      const secondColumn = page.locator('ion-picker-column#second');

      await secondColumn.evaluate((el: HTMLIonPickerColumnElement) => el.setFocus());
      await expect(secondColumn).toBeFocused();

      await page.waitForChanges();

      // Focus first column
      await page.keyboard.press('Shift+Tab');
      await expect(firstColumn).toBeFocused();
    });
  });
});
