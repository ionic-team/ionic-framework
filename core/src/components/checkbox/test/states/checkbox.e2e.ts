import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: states'), () => {
    test('should render disabled checkbox correctly', async ({ page }) => {
      await page.setContent(
        `
          <ion-checkbox disabled>Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-disabled`));
    });

    test('should render disabled invalid checkbox correctly', async ({ page }) => {
      await page.setContent(
        `
          <ion-checkbox disabled="true" error-text="Error text" class="ion-invalid">Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`invalid-checkbox-disabled`));
    });

    test('should render disabled checked checkbox correctly', async ({ page }) => {
      await page.setContent(
        `
          <ion-checkbox checked disabled>Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-checked-disabled`));
    });

    test('should render checked checkbox correctly', async ({ page }) => {
      await page.setContent(
        `
          <ion-checkbox checked>Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-checked`));
    });

    test('should render unchecked checkbox correctly', async ({ page }) => {
      await page.setContent(
        `
          <ion-checkbox>Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-unchecked`));
    });

    test('should render focus checkbox correctly', async ({ page }) => {
      await page.setContent(
        `
          <div id="checkboxes" style="padding: 8px">
            <ion-checkbox class="ion-focused">Label</ion-checkbox>
            <ion-checkbox class="ion-focused" checked>Label</ion-checkbox>
            <ion-checkbox class="ion-invalid ion-focused">Label</ion-checkbox>
          </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-focused`));
    });

    test('should render checkbox hover correctly', async ({ page }) => {
      await page.setContent(
        `
          <div id="checkboxes">
            <ion-checkbox>Label</ion-checkbox>
            <ion-checkbox checked>Label</ion-checkbox>
          </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await checkboxes.hover();
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-hover`));
    });

    test('should render checkbox active correctly', async ({ page }) => {
      await page.setContent(
        `
          <div id="checkboxes">
            <ion-checkbox class="ion-activated">Label</ion-checkbox>
            <ion-checkbox class="ion-activated" checked>Label</ion-checkbox>
          </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-active`));
    });
  });
});
