import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: card', () => {
  test('should render correctly in card', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setContent(`
      <ion-card>
        <ion-card-content>
          <ion-item style="border: 1px solid grey; margin: 16px">
            <ion-input label="input" label-placement="stacked"></ion-input>
          </ion-item>
        </ion-card-content>
      </ion-card>
    `);

    const card = page.locator('ion-card');
    expect(await card.screenshot()).toMatchSnapshot(`input-card-${page.getSnapshotSettings()}.png`);
  });
});
