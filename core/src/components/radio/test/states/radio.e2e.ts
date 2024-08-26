import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: states'), () => {
    test('should render disabled radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio disabled="true">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-disabled`));
    });

    test('should render disabled checked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio disabled="true" value="1">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-checked-disabled`));
    });

    test('should render checked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="true">
          <ion-radio value="true">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-checked`));
    });

    test('should render unchecked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio value="true">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-unchecked`));
    });
  });
});

/**
 * Focused and Pressed states are only available in the Ionic theme
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: states'), () => {
    test('should render pressed unchecked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio class="ion-activated">Enable Notifications</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-unchecked-pressed`));
    });

    test('should render pressed checked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="true">
          <ion-radio class="ion-activated" value="true">Enable Notifications</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-checked-pressed`));
    });

    test('should render focused unchecked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio class="ion-focused">Enable Notifications</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-unchecked-focused`));
    });

    test('should render focused checked radio correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="true">
          <ion-radio class="ion-focused" value="true">Enable Notifications</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-checked-focused`));
    });
  });
});
