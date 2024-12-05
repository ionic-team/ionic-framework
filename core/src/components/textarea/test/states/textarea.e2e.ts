import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: states'), () => {
    test('should render readonly textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" value="hi@ionic.io" readonly="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-readonly`));
    });

    test('should render disabled textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" value="hi@ionic.io" disabled="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-disabled`));
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('focused'), () => {
    test('should render focused textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <div class="container ion-padding">
          <ion-textarea fill="outline" value="hi@ionic.io" class="has-focus"></ion-textarea>
        </div>
      `,

      
        config
      );

      const container = page.locator('.container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-focused`));
    });
  });
});
