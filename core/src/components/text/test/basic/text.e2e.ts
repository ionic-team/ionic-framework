import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('text: basic', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Text does not have per-mode styles');
  });
  test('should render default text', async ({ page }) => {
    await page.setContent(`
      <ion-text>
        <strong>The quick brown fox <ion-text><sup>jumps</sup></ion-text> over the <ion-text><sub>lazy dog</sub></ion-text></strong>
      </ion-text>
    `);

    const text = page.locator('ion-text');
    expect(await text.nth(0).screenshot()).toMatchSnapshot(`text-${page.getSnapshotSettings()}.png`);
  });
  test('should render text with color prop', async ({ page }) => {
    await page.setContent(`
      <ion-text color="primary">
        <strong>The quick brown fox <ion-text color="success"><sup>jumps</sup></ion-text> over the <ion-text color="danger"><sub>lazy dog</sub></ion-text></strong>
      </ion-text>
    `);

    const text = page.locator('ion-text');
    expect(await text.nth(0).screenshot()).toMatchSnapshot(`text-color-${page.getSnapshotSettings()}.png`);
  });
});
