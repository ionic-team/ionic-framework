import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 * This behavior only applies to the `ionic` theme.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: rows'), () => {
    test('should respect rows attribute', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="1"
            label="Comments"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            label="Medium"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="8"
            label="Large"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows`));
    });

    test('should respect rows attribute with different sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="3"
            size="small"
            label="Small Size"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            size="medium"
            label="Medium Size"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            size="large"
            label="Large Size"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-sizes`));
    });

    test('should respect rows when auto-grow is enabled', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="3"
            auto-grow="true"
            label="Comments"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-autogrow`));
    });
  });
});
