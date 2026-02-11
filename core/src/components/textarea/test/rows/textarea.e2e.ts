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
          helper-text="rows=3, label-placement=stacked"
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
            helper-text="rows=2, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="5"
            label="Medium"
            label-placement="stacked"
            helper-text="rows=5, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="8"
            label="Large"
            label-placement="stacked"
            helper-text="rows=8, label-placement=stacked"
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
            helper-text="rows=4, fill=outline, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="4"
            fill="solid"
            label="Solid"
            label-placement="stacked"
            helper-text="rows=4, fill=solid, label-placement=stacked"
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
            helper-text="rows=3, size=small, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            size="medium"
            label="Medium Size"
            label-placement="stacked"
            helper-text="rows=3, size=medium, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            size="large"
            label="Large Size"
            label-placement="stacked"
            helper-text="rows=3, size=large, label-placement=stacked"
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
          helper-text="rows=3, label-placement=stacked"
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
          helper-text="rows=3, auto-grow=true, label-placement=stacked"
          value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
        ></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-rows-3-autogrow`));
    });

    test('should respect rows attribute with different label placements', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="3"
            fill="outline"
            label="Start"
            label-placement="start"
            helper-text="rows=3, fill=outline, label-placement=start"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            fill="outline"
            label="End"
            label-placement="end"
            helper-text="rows=3, fill=outline, label-placement=end"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            fill="outline"
            label="Floating"
            label-placement="floating"
            helper-text="rows=3, fill=outline, label-placement=floating"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            fill="outline"
            label="Fixed"
            label-placement="fixed"
            helper-text="rows=3, fill=outline, label-placement=fixed"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            fill="outline"
            label="Stacked"
            label-placement="stacked"
            helper-text="rows=3, fill=outline, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-label-placements`));
    });

    test('should respect rows attribute with different shapes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex; flex-direction: column; gap: 20px;">
          <ion-textarea
            rows="3"
            shape="soft"
            fill="outline"
            label="Soft"
            label-placement="stacked"
            helper-text="rows=3, shape=soft, fill=outline, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            shape="round"
            fill="outline"
            label="Round"
            label-placement="stacked"
            helper-text="rows=3, shape=round, fill=outline, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
          <ion-textarea
            rows="3"
            shape="rectangular"
            fill="outline"
            label="Rectangular"
            label-placement="stacked"
            helper-text="rows=3, shape=rectangular, fill=outline, label-placement=stacked"
            value="1&#10;2&#10;3&#10;4&#10;5&#10;6&#10;7&#10;8&#10;9&#10;0"
          ></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`textarea-rows-shapes`));
    });
  });
});
