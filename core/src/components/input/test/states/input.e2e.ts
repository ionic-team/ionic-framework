import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: states'), () => {
    test('should render readonly input correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="hi@ionic.io" readonly="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-readonly`));
    });

    test('should render disabled input correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="hi@ionic.io" disabled="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-disabled`));
    });

    test('should maintain consistent height when password toggle is hidden on disabled input', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29562',
      });
      await page.setContent(
        `
        <ion-input label="Password" type="password" value="password123">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');

      // Get the height when input is enabled
      const enabledHeight = await input.boundingBox().then(box => box?.height);

      // Disable the input
      await input.evaluate(el => el.setAttribute('disabled', 'true'));
      await page.waitForChanges();

      // Get the height when input is disabled
      const disabledHeight = await input.boundingBox().then(box => box?.height);

      // Verify heights are the same
      expect(enabledHeight).toBe(disabledHeight);
    });


    test('should maintain consistent height when password toggle is hidden on readonly input', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29562',
      });
      await page.setContent(
        `
        <ion-input label="Password" type="password" value="password123">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');

      // Get the height when input is enabled
      const enabledHeight = await input.boundingBox().then(box => box?.height);

      // Make the input readonly
      await input.evaluate(el => el.setAttribute('readonly', 'true'));
      await page.waitForChanges();

      // Get the height when input is readonly
      const readonlyHeight = await input.boundingBox().then(box => box?.height);

      // Verify heights are the same
      expect(enabledHeight).toBe(readonlyHeight);
    });
  });
});
