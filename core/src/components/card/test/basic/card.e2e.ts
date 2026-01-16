import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('card: rendering'), () => {
    test('should not have visual regressions with basic card', async ({ page }) => {
      await page.setContent(
        `
        <ion-card>
          <ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
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
      await expect(card).toHaveScreenshot(screenshot(`card-diff`));
    });
  });
});
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card: feature rendering'), () => {
    test('should not have visual regressions with button cards', async ({ page }) => {
      await page.setContent(
        `
        <ion-card button="true">
          <ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
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
      await expect(card).toHaveScreenshot(screenshot(`card-button`));
    });

    test('should not have visual regressions with disabled card', async ({ page }) => {
      await page.setContent(
        `
        <ion-card disabled="true">
          <ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
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
      await expect(card).toHaveScreenshot(screenshot(`card-disabled`));
    });
    test('should not have visual regressions with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-card color="danger">
          <ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
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
      await expect(card).toHaveScreenshot(screenshot(`card-color`));
    });
    test('should render even without header or content elements', async ({ page }) => {
      await page.setContent(
        `
        <ion-card>
          <ion-list lines="none">
            <ion-item href="#" class="ion-activated">
              <ion-icon name="wifi" slot="start"></ion-icon>
              <ion-label>Link Item activated</ion-label>
              <ion-note>More</ion-note>
            </ion-item>

            <ion-item href="#">
              <ion-icon name="wine" slot="start"></ion-icon>
              <ion-label>Link Item</ion-label>
              <ion-note>More</ion-note>
            </ion-item>

            <ion-item button="true" class="ion-activated">
              <ion-icon name="warning" slot="start"></ion-icon>
              <ion-label>Button Item activated</ion-label>
              <ion-note>More</ion-note>
            </ion-item>

            <ion-item button="true">
              <ion-icon name="walk" slot="start"></ion-icon>
              <ion-label>Button Item</ion-label>
              <ion-note>More</ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
      `,
        config
      );

      const card = page.locator('ion-card');
      await expect(card).toHaveScreenshot(screenshot(`card-no-content-or-header`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card: translucent'), () => {
    test('should not have visual regressions with translucent cards', async ({ page }) => {
      await page.setContent(
        `
        <ion-card>
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/card/test/img.jpg" />
          </div>
          <ion-card-header translucent="true">
            <ion-card-title> Title </ion-card-title>
            <ion-card-subtitle> Subtitle </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content style="min-height: 20px"></ion-card-content>
        </ion-card>
      `,
        config
      );

      const card = page.locator('ion-card');
      await expect(card).toHaveScreenshot(screenshot(`card-translucent`));
    });
  });
});
