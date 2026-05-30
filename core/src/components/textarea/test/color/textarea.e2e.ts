import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
/**
 * iOS does not have any color theming besides
 * the caret which cannot be captured in a
 * stable manner in screenshots.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: color'), () => {
    /**
     * Manually setting the .has-focus class
     * lets us quickly test the rendering of a
     * focused textarea without need to wait for
     * focus events.
     */
    test.describe('textarea: fill none', () => {
      test('should set label and highlight color on focus with start label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-color-start`));
      });
      test('should set label and highlight color on focus with end label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-color-end`));
      });
      test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-color-fixed`));
      });
      test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-color-floating`));
      });
      test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-color-stacked`));
      });
    });
    test.describe('textarea: fill solid', () => {
      test('should set label and highlight color on focus with start label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-color-start`));
      });
      test('should set label and highlight color on focus with end label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-color-end`));
      });
      test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-color-fixed`));
      });
      test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-color-floating`));
      });
      test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="solid" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-color-stacked`));
      });
    });
    test.describe('textarea: fill outline', () => {
      test('should set label and highlight color on focus with start label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-color-start`));
      });
      test('should set label and highlight color on focus with end label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-color-end`));
      });
      test('should set label and highlight color on focus with fixed label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-color-fixed`));
      });
      test('should set label and highlight color on focus with floating label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-color-floating`));
      });
      test('should set label and highlight color on focus with stacked label placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea fill="outline" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-color-stacked`));
      });
    });
  });
});
