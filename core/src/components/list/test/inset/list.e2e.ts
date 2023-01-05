import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: inset', () => {
  test.describe('list: rendering', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-content color="primary">
          <div class="wrapper" style="display: flex">
            <ion-list inset="true" style="width: 100%">
              <ion-item>Pokémon Yellow</ion-item>
              <ion-item>Super Metroid</ion-item>
              <ion-item>Mega Man X</ion-item>
              <ion-item>The Legend of Zelda</ion-item>
              <ion-item lines="full">Halo</ion-item>
            </ion-list>
          </div>
        </ion-content>
      `);

      const listWrapper = page.locator('.wrapper');

      expect(await listWrapper.screenshot()).toMatchSnapshot(`list-inset-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
