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

    test.describe('soft', () => {
      test('should not have visual regressions when containing text', async ({ page }) => {
        await page.setContent(
          `
          <style>
            #container {
              display: flex;
              gap: 10px;
            }
          </style>

          <div id="container">
            <ion-avatar shape="soft" size="xxsmall">A</ion-avatar>
            <ion-avatar shape="soft" size="xsmall">AB</ion-avatar>
            <ion-avatar shape="soft" size="small">AB</ion-avatar>
            <ion-avatar shape="soft">AB</ion-avatar>
          </div>
        `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`avatar-shape-soft-text`));
      });

      test('should not have visual regressions when containing an icon', async ({ page }) => {
        await page.setContent(
          `
          <style>
            #container {
              display: flex;
              gap: 10px;
            }
          </style>

          <div id="container">
            <ion-avatar shape="soft" size="xxsmall">
              <ion-icon name="person-outline"></ion-icon>
            </ion-avatar>
            <ion-avatar shape="soft" size="xsmall">
              <ion-icon name="person-outline"></ion-icon>
            </ion-avatar>
            <ion-avatar shape="soft" size="small">
              <ion-icon name="person-outline"></ion-icon>
            </ion-avatar>
            <ion-avatar shape="soft">
              <ion-icon name="person-outline"></ion-icon>
            </ion-avatar>
          </div>
        `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`avatar-shape-soft-icon`));
      });

      test('should not have visual regressions when containing an image', async ({ page }) => {
        await page.setContent(
          `
          <style>
            #container {
              display: flex;
              gap: 10px;
            }
          </style>

          <div id="container">
            <ion-avatar shape="soft" size="xxsmall">
              <img src="/src/components/avatar/test/avatar.svg"/>
            </ion-avatar>
            <ion-avatar shape="soft" size="xsmall">
              <img src="/src/components/avatar/test/avatar.svg"/>
            </ion-avatar>
            <ion-avatar shape="soft" size="small">
              <img src="/src/components/avatar/test/avatar.svg"/>
            </ion-avatar>
            <ion-avatar shape="soft">
              <img src="/src/components/avatar/test/avatar.svg"/>
            </ion-avatar>
          </div>
        `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`avatar-shape-soft-image`));
      });
    });
  });
});
