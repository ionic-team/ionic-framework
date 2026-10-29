import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <style>
          /* ios and ionic center the title, so a second title would overlap it */
          .ios .hide-when-centered,
          .ionic .hide-when-centered {
            display: none;
          }
        </style>

        <div id="container">
          <ion-header>
            <ion-toolbar>
              <ion-title>Settings</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-header>
            <ion-toolbar>
              <ion-title>Browse</ion-title>
              <ion-buttons slot="end">
                <ion-button>Cancel</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-header>
            <ion-toolbar class="toolbar-title-default">
              <ion-buttons slot="start">
                <ion-back-button default-href="#"></ion-back-button>
              </ion-buttons>
              <ion-title>Title</ion-title>
              <ion-title class="hide-when-centered" size="small">Subtitle</ion-title>
              <ion-buttons slot="end">
                <ion-button><ion-icon slot="icon-only" name="search"></ion-icon></ion-button>
                <ion-button><ion-icon slot="icon-only" name="menu"></ion-icon></ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-header>
            <ion-toolbar>
              <ion-title size="small">Choose a contact to add to Favorites</ion-title>
            </ion-toolbar>
            <ion-toolbar>
              <ion-title>Contacts</ion-title>
              <ion-buttons slot="end">
                <ion-button>Cancel</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-header>
            <ion-toolbar color="secondary">
              <ion-title size="small">
                Choose multiple contacts to add to your Favorites so this just goes on and on and on
              </ion-title>
            </ion-toolbar>
            <ion-toolbar color="secondary">
              <ion-buttons slot="start">
                <ion-button>Groups</ion-button>
              </ion-buttons>
              <ion-title>Contacts</ion-title>
              <ion-buttons slot="end">
                <ion-button>Cancel</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`title-basic`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: special characters'), () => {
    test('should not cut off characters', async ({ page }) => {
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar>
            <ion-title size="large">ÔÔÔ</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const title = page.locator('ion-title');
      await expect(title).toHaveScreenshot(screenshot('title-characters'));
    });
  });
});
