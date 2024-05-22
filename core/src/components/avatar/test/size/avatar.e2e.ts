import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: size'), () => {
    test.describe('small', () => {
      test('should not have visual regressions when containing text', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar size="small">AB</ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-size-small-text`));
      });

      test('should not have visual regressions when containing an icon', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar size="small">
            <ion-icon name="person-outline"></ion-icon>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-size-small-icon`));
      });

      test('should not have visual regressions when containing an image', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar size="small">
            <img src="/src/components/avatar/test/avatar.svg"/>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-size-small-image`));
      });
    });

    test.describe('medium', () => {
      test('should not have visual regressions when containing text', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar size="medium">AB</ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-size-medium-text`));
      });

      test('should not have visual regressions when containing an icon', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar size="medium">
            <ion-icon name="person-outline"></ion-icon>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-size-medium-icon`));
      });

      test('should not have visual regressions when containing an image', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar size="medium">
            <img src="/src/components/avatar/test/avatar.svg"/>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-size-medium-image`));
      });
    });
  });
});
