import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: item', () => {
  test('should render correctly in list with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-textarea
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`textarea-list-no-fill-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-item>
          <ion-textarea
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`textarea-inset-list-no-fill-${page.getSnapshotSettings()}.png`);
  });
});
