import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: card', () => {
  test('should render correctly in card', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setContent(`
      <ion-card>
        <ion-card-content>
          <ion-item style="border: 1px solid grey" lines="none">
            <ion-select label="select" label-placement="stacked"></ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
    `);

    const card = page.locator('ion-card');
    expect(await card.screenshot()).toMatchSnapshot(`select-card-${page.getSnapshotSettings()}.png`);
  });
});
