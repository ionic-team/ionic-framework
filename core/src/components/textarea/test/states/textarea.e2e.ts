import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: states'), () => {
    test('should render readonly textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" label-placement="stacked" value="hi@ionic.io" helper-text="Helper text" error-text="Error text" counter="true" maxlength="99" readonly="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-readonly`));
    });

    test('should render disabled textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" label-placement="stacked" value="hi@ionic.io" helper-text="Helper text" error-text="Error text" counter="true" maxlength="99" disabled="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-disabled`));
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: focused'), () => {
    test('should render focused textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <div class="container ion-padding">
          <ion-textarea label="Label" label-placement="stacked" fill="outline" value="hi@ionic.io" helper-text="Helper text" error-text="Error text" counter="true" maxlength="99" class="has-focus"></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('.container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-focused`));
    });

    test('should render focused valid textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <div class="container ion-padding">
          <ion-textarea label="Label" label-placement="stacked" fill="outline" value="hi@ionic.io" helper-text="Helper text" error-text="Error text" counter="true" maxlength="99" class="ion-valid has-focus"></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('.container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-focused-valid`));
    });
  });
});
