import { expect } from '@playwright/test';
import { configs, keepSafariHairlines, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('list: basic'), () => {
    keepSafariHairlines(config);

    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-content>
          <ion-list>
            <ion-item>Pokémon Yellow</ion-item>
            <ion-item>Super Metroid</ion-item>
            <ion-item>Mega Man X</ion-item>
            <ion-item>The Legend of Zelda</ion-item>
            <ion-item lines="full">Halo</ion-item>
          </ion-list>
        </ion-content>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`list-basic-diff`));
    });
  });
});
