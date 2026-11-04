import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: size'), () => {
    test('should render small, medium and large buttons', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .sizes-container {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 10px;
            padding: 6px;
          }
        </style>

        <div class="sizes-container">
          <ion-button size="small" fill="solid">Small Button</ion-button>
          <ion-button size="medium" fill="solid">Medium Button</ion-button>
          <ion-button size="large" fill="solid">Large Button</ion-button>
          <ion-buttons>
            <ion-button size="small" fill="solid">Small Button</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button size="medium" fill="solid">Medium Button</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button size="large" fill="solid">Large Button</ion-button>
          </ion-buttons>
        </div>
      `,
        config
      );

      const container = page.locator('.sizes-container');

      await expect(container).toHaveScreenshot(screenshot(`button-size`));
    });
  });
});

/**
 * This behavior does not vary across modes or directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('button: size tokens'), () => {
    test('should shorten the button when its min height and padding are lowered', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30625',
      });

      await page.setContent(`<ion-button>Button</ion-button>`, config);

      const button = page.locator('ion-button');
      const defaultHeight = (await button.boundingBox())!.height;

      await button.evaluate((el: HTMLIonButtonElement) => {
        el.style.setProperty('--ion-button-size-medium-min-height', '0px');
        el.style.setProperty('--ion-button-size-medium-padding-top', '2px');
        el.style.setProperty('--ion-button-size-medium-padding-bottom', '2px');
      });

      const shortHeight = (await button.boundingBox())!.height;

      expect(shortHeight).toBeLessThan(defaultHeight);
    });
  });
});
