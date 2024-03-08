import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: custom'), () => {
    test('should be able to customize select using css apis', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27208',
      });

      await page.setContent(
        `
        <ion-select label="Select" value="a">
          <ion-select-option value="a">Apple</ion-select-option>
        </ion-select>

        <style>
          ion-select {
            color: white;

            --background: #0088cc;
            --border-radius: 20px;
            --padding-start: 16px;
            --padding-end: 16px;
            --padding-top: 16px;
            --padding-bottom: 16px;
          }

          ion-select::part(icon) {
            color: white;
          }
        </style>
      `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-custom-diff`));
    });
    test('should be able to customize select label, placeholder, and value using css parts', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27112',
      });

      await page.setContent(
        `
        <div class="wrapper">
          <ion-select label="Select" label-placement="stacked" placeholder="Fruits">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>

          <ion-select label="Select" label-placement="stacked" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
        </div>

        <style>
          ion-select::part(container) {
            color: purple;
          }

          ion-select::part(label) {
            color: green;
          }
        </style>
      `,
        config
      );

      const wrapper = page.locator('.wrapper');
      await expect(wrapper).toHaveScreenshot(screenshot(`select-custom-parts-diff`));
    });
  });
});
