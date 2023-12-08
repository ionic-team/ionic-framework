import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: start and end slots (visual checks)'), () => {
    test('should not have visual regressions with a start-positioned label', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="start" fill="solid" value="100" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-button fill="clear" slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-slots-label-start`));
    });

    test('should not have visual regressions with a floating label', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" fill="solid" value="100" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-button fill="clear" slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-slots-label-floating`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: start and end slots (functionality checks)'), () => {
    test('should raise floating label when there is content in the start slot', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" fill="solid" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveClass(/label-floating/);
    });

    test('should raise floating label when there is content in the end slot', async ({ page }) => {
      await page.setContent(
        `
          <ion-textarea label-placement="floating" fill="solid" label="Weight">
            <ion-icon slot="end" name="barbell" aria-hidden="true"></ion-icon>
          </ion-textarea>
        `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveClass(/label-floating/);
    });
  });
});
