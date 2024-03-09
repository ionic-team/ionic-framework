import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label>Label</ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-scale`));
    });
    test('should scale text on larger font sizes when wrapping', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label class="ion-text-wrap">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-wrap-scale`));
    });
    test('should scale text on larger font sizes when label contains headings and paragraphs', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <p>Paragraph</p>
        </ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-headings-scale`));
    });
    test('should scale text on larger font sizes when position is stacked', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label position="stacked">Stacked</ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-stacked-scale`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['md'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('label: a11y for ion-color()'), () => {
    test('should not have accessibility violations when focused', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
          <main>
            <div class="ion-focused">
              <ion-label position="stacked">Default Label</ion-label>
            </div>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: text wrapping in item'), () => {
    test('long text should not cause label to expand infinitely', async ({ page }) => {
      await page.setContent(
        `
        <style>
          div {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        </style>
        <ion-item>
          <ion-label>
            <!-- This text should be truncated with ellipses -->
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </ion-label>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`label-item-wrap`));
    });
  });
});
