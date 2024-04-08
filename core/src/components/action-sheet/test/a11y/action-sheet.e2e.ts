import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const testAria = async (page: E2EPage, buttonID: string, expectedAriaLabelledBy: string | null) => {
  const didPresent = await page.spyOnEvent('ionActionSheetDidPresent');
  const button = page.locator(`#${buttonID}`);

  await button.click();
  await didPresent.next();

  const actionSheet = page.locator('ion-action-sheet');

  /**
   * expect().toHaveAttribute() can't check for a null value, so grab and check
   * the value manually instead.
   */
  const ariaLabelledBy = await actionSheet.getAttribute('aria-labelledby');

  expect(ariaLabelledBy).toBe(expectedAriaLabelledBy);
};

const testAriaButton = async (
  page: E2EPage,
  buttonID: string,
  expectedAriaLabelledBy: string,
  expectedAriaLabel: string
) => {
  const didPresent = await page.spyOnEvent('ionActionSheetDidPresent');

  const button = page.locator(`#${buttonID}`);
  await button.click();

  await didPresent.next();

  const actionSheetButton = page.locator('ion-action-sheet .action-sheet-button');

  await expect(actionSheetButton).toHaveAttribute('aria-labelledby', expectedAriaLabelledBy);
  await expect(actionSheetButton).toHaveAttribute('aria-label', expectedAriaLabel);
};

configs({ directions: ['ltr'], palettes: ['dark', 'light'] }).forEach(({ config, title }) => {
  test.describe(title('action-sheet: Axe testing'), () => {
    test('should not have accessibility violations when header is defined', async ({ page }) => {
      await page.setContent(
        `
          <ion-action-sheet></ion-action-sheet>

          <script>
            const actionSheet = document.querySelector('ion-action-sheet');
            actionSheet.header = 'Header';
            actionSheet.subHeader = 'Subtitle';
            actionSheet.buttons = ['Confirm'];
          </script>
        `,
        config
      );

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const actionSheet = page.locator('ion-action-sheet');

      await actionSheet.evaluate((el: HTMLIonActionSheetElement) => el.present());
      await ionActionSheetDidPresent.next();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('action-sheet: aria attributes'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/a11y`, config);
    });

    test('should have aria-labelledby when header is set', async ({ page }) => {
      await testAria(page, 'bothHeaders', 'action-sheet-1-header');
    });

    test('should not have aria-labelledby when header is not set', async ({ page }) => {
      await testAria(page, 'noHeaders', null);
    });

    test('should allow for manually specifying aria attributes', async ({ page }) => {
      await testAria(page, 'customAria', 'Custom title');
    });

    test('should have aria-labelledby and aria-label added to the button when htmlAttributes is set', async ({
      page,
    }) => {
      await testAriaButton(page, 'ariaLabelButton', 'close-label', 'close button');
    });

    test('should have aria-labelledby and aria-label added to the cancel button when htmlAttributes is set', async ({
      page,
    }) => {
      await testAriaButton(page, 'ariaLabelCancelButton', 'cancel-label', 'cancel button');
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('action-sheet: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <ion-action-sheet></ion-action-sheet>

        <script>
          const actionSheet = document.querySelector('ion-action-sheet');
          actionSheet.header = 'Header';
          actionSheet.subHeader = 'Sub Header';
          actionSheet.buttons = ['Ok', { role: 'cancel', text: 'Cancel' }];
        </script>
      `,
        config
      );

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const actionSheet = page.locator('ion-action-sheet');

      await actionSheet.evaluate((el: HTMLIonActionSheetElement) => el.present());
      await ionActionSheetDidPresent.next();

      await expect(actionSheet).toHaveScreenshot(screenshot(`action-sheet-scale`));
    });
  });
});
