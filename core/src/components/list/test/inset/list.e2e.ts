import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: inset', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render full lines while allowing for overrides', async ({ page }) => {
    await page.setContent(`
      <ion-content color="primary">
        <div class="wrapper" style="display: flex">
          <ion-list inset="true" style="width: 100%" lines="full">
            <ion-item>
              <ion-input value="Input Text"></ion-input>
            </ion-item>
            <ion-item>Pokémon Yellow</ion-item>
            <ion-item lines="inset">Super Metroid (with Inset Line)</ion-item>
            <ion-item lines="none">Mega Man X (with No Line)</ion-item>
            <ion-item>The Legend of Zelda</ion-item>
            <ion-item lines="full">Halo</ion-item>
          </ion-list>
        </div>
      </ion-content>
    `);

    const listWrapper = page.locator('.wrapper');

    await expect(listWrapper).toHaveScreenshot(`list-inset-full-lines-${page.getSnapshotSettings()}.png`);
  });
  test('should render inset lines while allowing for overrides', async ({ page }) => {
    await page.setContent(`
      <ion-content color="primary">
        <div class="wrapper" style="display: flex">
          <ion-list inset="true" style="width: 100%" lines="inset">
            <ion-item>
              <ion-input value="Input Text"></ion-input>
            </ion-item>
            <ion-item>Pokémon Yellow</ion-item>
            <ion-item lines="full">Super Metroid (with Full Line)</ion-item>
            <ion-item lines="none">Mega Man X (with No Line)</ion-item>
            <ion-item>The Legend of Zelda</ion-item>
            <ion-item lines="full">Halo</ion-item>
          </ion-list>
        </div>
      </ion-content>
    `);

    const listWrapper = page.locator('.wrapper');

    await expect(listWrapper).toHaveScreenshot(`list-inset-inset-lines-${page.getSnapshotSettings()}.png`);
  });
  test('should render no lines while allowing for overrides', async ({ page }) => {
    await page.setContent(`
      <ion-content color="primary">
        <div class="wrapper" style="display: flex">
          <ion-list inset="true" style="width: 100%" lines="none">
            <ion-item>
              <ion-input value="Input Text"></ion-input>
            </ion-item>
            <ion-item>Pokémon Yellow</ion-item>
            <ion-item lines="full">Super Metroid (with Full Line)</ion-item>
            <ion-item lines="inset">Mega Man X (with Inset Line)</ion-item>
            <ion-item>The Legend of Zelda</ion-item>
            <ion-item lines="full">Halo</ion-item>
          </ion-list>
        </div>
      </ion-content>
    `);

    const listWrapper = page.locator('.wrapper');

    await expect(listWrapper).toHaveScreenshot(`list-inset-no-lines-${page.getSnapshotSettings()}.png`);
  });
});
