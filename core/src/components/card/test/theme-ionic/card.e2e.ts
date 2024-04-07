import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card: Shapes'), () => {
    test('Shape Soft: should not have visual regressions with basic card', async ({ page }) => {
      await page.setContent(
        `
        <ion-card shape="soft">
          <ion-card-header>
            <ion-card-subtitle >Card Subtitle</ion-card-subtitle>
            <ion-card-title >Card Title</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week
            in the woods. Wash your spirit clean.
          </ion-card-content>
        </ion-card>
      `,
        config
      );

      const card = page.locator('ion-card');
      await expect(card).toHaveScreenshot(screenshot(`card-soft`));
    });
    test('Shape Round: should not have visual regressions with basic card', async ({ page }) => {
      await page.setContent(
        `
        <ion-card shape="round">
          <ion-card-header>
            <ion-card-subtitle >Card Subtitle</ion-card-subtitle>
            <ion-card-title >Card Title</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week
            in the woods. Wash your spirit clean.
          </ion-card-content>
        </ion-card>
      `,
        config
      );

      const card = page.locator('ion-card');
      await expect(card).toHaveScreenshot(screenshot(`card-round`));
    });
    test('Shape Rectangular: should not have visual regressions with basic card', async ({ page }) => {
      await page.setContent(
        `
        <ion-card shape="rectangular">
          <ion-card-header>
            <ion-card-subtitle >Card Subtitle</ion-card-subtitle>
            <ion-card-title >Card Title</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week
            in the woods. Wash your spirit clean.
          </ion-card-content>
        </ion-card>
      `,
        config
      );

      const card = page.locator('ion-card');
      await expect(card).toHaveScreenshot(screenshot(`card-rectangular`));
    });
  });
});