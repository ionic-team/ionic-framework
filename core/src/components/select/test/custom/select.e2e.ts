import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: custom', () => {
  test('should be able to customize select using css apis', async ({ page, skip }) => {
    skip.rtl();

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/27208',
    });

    await page.setContent(`
      <ion-select label="Select" value="a">
        <ion-select-option value="a">Apple</ion-select-option>
      </ion-select>

      <style>
        ion-select {
          color: white;

          --background: #0088cc;
          --border-radius: 20px;
          --padding-start: 16px;
          --padding-end: 16px;
          --padding-top: 16px;
          --padding-bottom: 16px;
        }

        ion-select::part(icon) {
          color: white;
        }
      </style>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-custon-diff-${page.getSnapshotSettings()}.png`);
  });
});
