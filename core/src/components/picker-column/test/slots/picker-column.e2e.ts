import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column: slots'), () => {
    test('should not have visual regressions with prefix and suffix', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="b">
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
            <div slot="prefix">Prefix</div>
            <div slot="suffix">Suffix</div>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const picker = page.locator('ion-picker');
      await expect(picker).toHaveScreenshot(screenshot(`picker-prefix-suffix`));
    });

    test('should not have visual regressions with a long prefix and suffix', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column value="b">
            <ion-picker-column-option value="a">A</ion-picker-column-option>
            <ion-picker-column-option value="b">B</ion-picker-column-option>
            <ion-picker-column-option value="c">C</ion-picker-column-option>
            <div slot="prefix">Long prefix long prefix long prefix</div>
            <div slot="suffix">Long suffix long suffix long suffix</div>
          </ion-picker-column>
        </ion-picker>
      `,
        config
      );

      const picker = page.locator('ion-picker');
      await expect(picker).toHaveScreenshot(screenshot(`picker-long-prefix-suffix`));
    });
  });
});
