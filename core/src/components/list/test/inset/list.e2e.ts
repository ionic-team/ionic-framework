import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: inset', () => {
  test.describe('list: rendering', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-content color="primary">
          <ion-list inset="true">
            <ion-item>Pokémon Yellow</ion-item>
            <ion-item>Super Metroid</ion-item>
            <ion-item>Mega Man X</ion-item>
            <ion-item>The Legend of Zelda</ion-item>
            <ion-item lines="full">Halo</ion-item>
          </ion-list>
        </ion-content>
      `);

      const list = page.locator('ion-list');

      expect(await list.screenshot()).toMatchSnapshot(`list-inset-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
