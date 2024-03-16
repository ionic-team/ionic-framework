import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/textarea/test/legacy/basic`, config);

      /**
       * The auto grow implementation uses a requestAnimationFrame to append styles to the textarea
       * on load. We need to wait for changes otherwise the screenshot can be taken before the
       * styles are applied.
       */
      await page.waitForChanges();

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`textarea-diff`));
    });

    test.describe(title('with floating labels'), () => {
      /**
       * Verifies the display of a floating label above an `ion-textarea`.
       * Captures a screenshot of the initial state (without a value) and verifies
       * that the label translates correctly after the value is set.
       */
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
        <ion-item>
          <ion-label position="floating">Floating Label</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>`,
          config
        );

        const item = page.locator('ion-item');
        const textarea = page.locator('ion-textarea');

        await expect(item).toHaveScreenshot(screenshot(`textarea-floating-label-initial`));

        await textarea.evaluate((el: HTMLIonTextareaElement) => {
          el.value = 'Updated value';
        });

        await page.waitForChanges();

        await page.setIonViewport();

        await expect(item).toHaveScreenshot(screenshot(`textarea-floating-label-diff`));
      });
    });
  });
});
