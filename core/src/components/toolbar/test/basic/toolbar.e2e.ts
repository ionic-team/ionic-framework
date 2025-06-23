import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'], palettes: ['light', 'dark'], directions: ['ltr'] }).forEach(
  ({ title, screenshot, config }) => {
    test.describe(title('toolbar: basic (LTR only)'), () => {
      test('should not have visual regressions with text only', async ({ page }) => {
        await page.setContent(
          `
          <ion-header>
            <ion-toolbar>
              <ion-title>Toolbar</ion-title>
            </ion-toolbar>
          </ion-header>
        `,
          config
        );

        const header = page.locator('ion-header');
        await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-text-only`));
      });

      test('should not have visual regressions with slotted images', async ({ page }) => {
        await page.setContent(
          `
          <ion-header>
            <ion-toolbar>
              <img src="/src/components/toolbar/test/image.svg" style="width: 50px; height: 50px;" slot="start"/>
              <ion-title>Toolbar</ion-title>
              <ion-img src="/src/components/toolbar/test/image.svg" style="width: 50px; height: 50px;" slot="end"/>
            </ion-toolbar>
          </ion-header>
        `,
          config
        );

        const header = page.locator('ion-header');
        await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-slotted-images`));
      });

      test('should not have visual regressions with slotted images with intrinsic width', async ({ page }) => {
        await page.setContent(
          `
          <ion-header>
            <ion-toolbar>
              <img src="https://picsum.photos/id/237/50/50" slot="start" />
              <ion-title>Image | Ion-Image</ion-title>
              <ion-img src="https://picsum.photos/id/237/50/50" slot="end"></ion-img>
            </ion-toolbar>
          </ion-header>
        `,
          config
        );

        const header = page.locator('ion-header');
        await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-slotted-images-intrinsic-width`));
      });
    });
  }
);

configs({ modes: ['ios', 'md', 'ionic-md'], palettes: ['light', 'dark'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toolbar: basic'), () => {
    test('should truncate long title with ellipsis', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar>
              <ion-title>This is the title that never ends. It just goes on and on my friend.</ion-title>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-long-text`));
    });

    test('should not have visual regressions with icon-only buttons', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="secondary">
                <ion-button>
                  <ion-icon slot="icon-only" name="person-circle"></ion-icon>
                </ion-button>
                <ion-button>
                  <ion-icon slot="icon-only" name="search"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-buttons slot="primary">
                <ion-button color="secondary">
                  <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-title>Toolbar</ion-title>
            </ion-toolbar>
            <ion-toolbar>
              <ion-buttons slot="secondary">
                <ion-button class="ion-activated">
                  <ion-icon slot="icon-only" name="person-circle"></ion-icon>
                </ion-button>
                <ion-button class="ion-activated">
                  <ion-icon slot="icon-only" name="search"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-buttons slot="primary">
                <ion-button color="secondary" class="ion-activated">
                  <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-title>Activated Buttons</ion-title>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-icon-buttons`));
    });

    test('should not have visual regressions with buttons with icons and text', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="secondary">
                <ion-button fill="solid">
                  <ion-icon slot="start" name="person-circle"></ion-icon>
                  Solid
                </ion-button>
              </ion-buttons>
              <ion-title>Solid</ion-title>
              <ion-buttons slot="primary">
                <ion-button fill="solid" color="secondary">
                  Help
                  <ion-icon slot="end" name="help-circle"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
              <ion-buttons slot="secondary">
                <ion-button fill="solid" class="ion-activated">
                  <ion-icon slot="start" name="person-circle"></ion-icon>
                  Solid
                </ion-button>
              </ion-buttons>
              <ion-title>Solid Activated</ion-title>
              <ion-buttons slot="primary">
                <ion-button fill="solid" color="secondary" class="ion-activated">
                  Help
                  <ion-icon slot="end" name="help-circle"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
              <ion-buttons slot="secondary">
                <ion-button fill="outline">
                  <ion-icon slot="start" name="star"></ion-icon>
                  Star
                </ion-button>
              </ion-buttons>
              <ion-title>Outline</ion-title>
              <ion-buttons slot="primary">
                <ion-button color="secondary" fill="outline">
                  Info
                  <ion-icon slot="end" name="information-circle"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
            <ion-toolbar>
              <ion-buttons slot="secondary">
                <ion-button fill="outline" class="ion-activated">
                  <ion-icon slot="start" name="star"></ion-icon>
                  Star
                </ion-button>
              </ion-buttons>
              <ion-title>Outline Activated</ion-title>
              <ion-buttons slot="primary">
                <ion-button color="secondary" fill="outline" class="ion-activated">
                  Info
                  <ion-icon slot="end" name="information-circle"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-text-icon-buttons`));
    });

    test('should not have visual regressions with text and button inside the content slot', async ({ page }) => {
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar>
              <ion-button fill="solid">
                <ion-icon slot="start" name="person-circle"></ion-icon>
                Solid
              </ion-button>
              <span>Solid</span>
            </ion-toolbar>
          </ion-header>
        `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`toolbar-basic-text-buttons-inside-content`));
    });
  });
});
