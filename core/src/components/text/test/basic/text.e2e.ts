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
        <h1>H1: The quick brown fox jumps over the lazy dog</h1>
        <p>This is <sub>subscript</sub>. <ion-text>This is nested text</ion-text>
      </ion-text>
    `);

    const text = page.locator('ion-text');
    expect(await text.nth(0).screenshot()).toMatchSnapshot(`text-${page.getSnapshotSettings()}.png`);
  });
  test('should render text with color prop', async ({ page }) => {
    await page.setContent(`
      <ion-text color="primary">
        <h1>H1: The quick brown fox jumps over the lazy dog</h1>
        <p>This is <sub>subscript</sub>. <ion-text color="danger">This is nested text</ion-text>
      </ion-text>
    `);

    const text = page.locator('ion-text');
    expect(await text.nth(0).screenshot()).toMatchSnapshot(`text-color-${page.getSnapshotSettings()}.png`);
  });
});
