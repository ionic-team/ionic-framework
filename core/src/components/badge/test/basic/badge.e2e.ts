import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            <ion-badge></ion-badge>
            <ion-badge>00</ion-badge>
            <ion-badge>
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="primary"></ion-badge>
            <ion-badge color="primary">1</ion-badge>
            <ion-badge color="primary">11</ion-badge>
            <ion-badge color="primary">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="secondary"></ion-badge>
            <ion-badge color="secondary">2</ion-badge>
            <ion-badge color="secondary">22</ion-badge>
            <ion-badge color="secondary">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="tertiary"></ion-badge>
            <ion-badge color="tertiary">3</ion-badge>
            <ion-badge color="tertiary">33</ion-badge>
            <ion-badge color="tertiary">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="success"></ion-badge>
            <ion-badge color="success">4</ion-badge>
            <ion-badge color="success">44</ion-badge>
            <ion-badge color="success">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="warning"></ion-badge>
            <ion-badge color="warning">5</ion-badge>
            <ion-badge color="warning">55</ion-badge>
            <ion-badge color="warning">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="danger"></ion-badge>
            <ion-badge color="danger">6</ion-badge>
            <ion-badge color="danger">66</ion-badge>
            <ion-badge color="danger">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="light"></ion-badge>
            <ion-badge color="light">7</ion-badge>
            <ion-badge color="light">77</ion-badge>
            <ion-badge color="light">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="medium"></ion-badge>
            <ion-badge color="medium">8</ion-badge>
            <ion-badge color="medium">88</ion-badge>
            <ion-badge color="medium">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
            <ion-badge color="dark"></ion-badge>
            <ion-badge color="dark">9</ion-badge>
            <ion-badge color="dark">99</ion-badge>
            <ion-badge color="dark">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('badge-basic'));
    });
  });
});
