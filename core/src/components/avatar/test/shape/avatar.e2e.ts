import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: shape'), () => {
    test.describe('round', () => {
      test('should not have visual regressions when containing text', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar shape="round">AB</ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-shape-round-text`));
      });

      test('should not have visual regressions when containing an icon', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar shape="round">
            <ion-icon name="person-outline"></ion-icon>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-shape-round-icon`));
      });

      test('should not have visual regressions when containing an image', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar shape="round">
            <img src="/src/components/avatar/test/avatar.svg"/>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-shape-round-image`));
      });
    });

    test.describe('rectangular', () => {
      test('should not have visual regressions when containing text', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar shape="rectangular">AB</ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-shape-rectangular-text`));
      });

      test('should not have visual regressions when containing an icon', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar shape="rectangular">
            <ion-icon name="person-outline"></ion-icon>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-shape-rectangular-icon`));
      });

      test('should not have visual regressions when containing an image', async ({ page }) => {
        await page.setContent(
          `
          <ion-avatar shape="rectangular">
            <img src="/src/components/avatar/test/avatar.svg"/>
          </ion-avatar>
        `,
          config
        );

        const avatar = page.locator('ion-avatar');

        await expect(avatar).toHaveScreenshot(screenshot(`avatar-shape-rectangular-image`));
      });
    });
  });
});
