import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: card', () => {
  test('should render correctly in card', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setContent(`
      <ion-card>
        <ion-card-content>
          <ion-item style="border: 1px solid grey; margin: 16px">
            <ion-textarea label="textarea" label-placement="stacked"></ion-textarea>
          </ion-item>
        </ion-card-content>
      </ion-card>
    `);

    const card = page.locator('ion-card');
    expect(await card.screenshot()).toMatchSnapshot(`textarea-card-${page.getSnapshotSettings()}.png`);
  });
});
