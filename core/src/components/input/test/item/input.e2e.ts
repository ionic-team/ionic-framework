import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: item', () => {
  test('should render correctly in list with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-input
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`input-list-no-fill-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-item>
          <ion-input
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`input-inset-list-no-fill-${page.getSnapshotSettings()}.png`);
  });
  test('input renders as modern when label is set asynchronously', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/27085',
    });

    await page.setContent(
      `<ion-item>
        <ion-input></ion-input>
      </ion-item>
      <ion-button onclick="setLabel()">Set label</ion-button>

      <script>
        function setLabel() {
          const input = document.querySelector('ion-input');
          input.label = 'New label';
        }
      </script>
      `
    );
    const input = page.locator('ion-input');
    // Initial template should be modern
    await expect(input).not.toHaveClass(/legacy-input/);

    // Click button to set label
    await page.click('ion-button');
    await page.waitForChanges();

    // Template should still be modern
    await expect(input).not.toHaveClass(/legacy-input/);
  });
});
