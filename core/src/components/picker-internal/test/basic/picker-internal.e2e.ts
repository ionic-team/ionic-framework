import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-internal: rendering'), () => {
    test('inline pickers should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`, config);

      const fullStack = page.locator('#inline button[data-value="full-stack"]');
      const onion = page.locator('#inline button[data-value="onion"]');

      await expect(fullStack).toHaveClass(/picker-item-active/);
      await expect(onion).toHaveClass(/picker-item-active/);

      await page.waitForChanges();

      await expect(page.locator('#inline')).toHaveScreenshot(screenshot(`picker-internal-inline-diff`));
    });
  });

  test.describe(title('picker-internal: overlay rendering'), () => {
    test('popover: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`, config);

      const button = page.locator('#popover');
      const didPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const pickerInternal = page.locator('ion-popover ion-picker-internal');

      await button.click();
      await didPresent.next();

      await expect(pickerInternal).toBeVisible();

      const popoverContent = page.locator('ion-popover .ion-delegate-host');

      await expect(popoverContent).toHaveScreenshot(screenshot(`picker-internal-popover-diff`), {
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
      await page.goto('/src/components/picker-internal/test/basic', config);

      const button = page.locator('#modal');
      const didPresent = await page.spyOnEvent('ionModalDidPresent');
      const pickerInternal = page.locator('ion-modal ion-picker-internal');

      await button.click();
      await didPresent.next();

      await expect(pickerInternal).toBeVisible();

      const modalContent = page.locator('ion-modal .ion-delegate-host');

      await expect(modalContent).toHaveScreenshot(screenshot(`picker-internal-modal-diff`), {
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
  test.describe(title('picker-internal: focus'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-internal>
          <ion-picker-column-internal value="full-stack" id="first"></ion-picker-column-internal>
          <ion-picker-column-internal value="onion" id="second"></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const columns = document.querySelectorAll('ion-picker-column-internal');
          columns[0].items = [
            { text: 'Minified', value: 'minified' },
            { text: 'Responsive', value: 'responsive' },
            { text: 'Full Stack', value: 'full-stack' },
            { text: 'Mobile First', value: 'mobile-first' },
            { text: 'Serverless', value: 'serverless' },
          ]

          columns[1].items = [
            { text: 'Tomato', value: 'tomato' },
            { text: 'Avocado', value: 'avocado' },
            { text: 'Onion', value: 'onion' },
            { text: 'Potato', value: 'potato' },
            { text: 'Artichoke', value: 'artichoke' },
          ];
        </script>
      `,
        config
      );
    });

    test('tabbing should correctly move focus between columns', async ({ page }) => {
      const firstColumn = page.locator('ion-picker-column-internal#first');
      const secondColumn = page.locator('ion-picker-column-internal#second');

      // Focus first column
      await page.keyboard.press('Tab');
      await expect(firstColumn).toBeFocused();

      await page.waitForChanges();

      // Focus second column
      await page.keyboard.press('Tab');
      await expect(secondColumn).toBeFocused();
    });

    test('tabbing should correctly move focus back', async ({ page }) => {
      const firstColumn = page.locator('ion-picker-column-internal#first');
      const secondColumn = page.locator('ion-picker-column-internal#second');

      await secondColumn.focus();
      await expect(secondColumn).toBeFocused();

      await page.waitForChanges();

      // Focus first column
      await page.keyboard.press('Shift+Tab');
      await expect(firstColumn).toBeFocused();
    });
  });
});
