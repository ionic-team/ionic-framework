import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Rows attribute is only available in the Ionic theme.
 * When set, it increases the container min-height to accommodate the number of rows.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: rows'), () => {
    test('should respect rows attribute and set min-height', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea
          rows="3"
          label="Comments"
          label-placement="stacked"
          value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
        ></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-rows-3`));
    });

    test('should respect rows attribute with different values', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="2"
            label="Small"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="5"
            label="Medium"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="8"
            label="Large"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-different-values`));
    });

    test('should respect rows attribute with fill outline and solid', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="4"
            fill="outline"
            label="Outline"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="4"
            fill="solid"
            label="Solid"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-4-fill`));
    });

    test('should respect rows attribute with different sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="3"
            size="small"
            label="Small Size"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            size="medium"
            label="Medium Size"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            size="large"
            label="Large Size"
            label-placement="stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-different-sizes`));
    });

    test('should respect rows attribute with value content', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea
          rows="3"
          label="Comments"
          label-placement="stacked"
          value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
        ></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-rows-3-with-value`));
    });

    test('should respect rows when auto-grow is enabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea
          rows="3"
          auto-grow="true"
          label="Comments"
          label-placement="stacked"
          value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
        ></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-rows-3-autogrow`));
    });
  });
});
