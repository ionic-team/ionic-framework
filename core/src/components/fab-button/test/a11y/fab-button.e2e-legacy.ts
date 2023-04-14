import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('fab-button: aria attributes', () => {
  test('should inherit aria attributes to inner button', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setContent(`
      <ion-fab-button aria-label="Hello World">My Button</ion-fab-button>
    `);

    const nativeButton = page.locator('ion-fab-button button');
    await expect(nativeButton).toHaveAttribute('aria-label', 'Hello World');
  });
});
