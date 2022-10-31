import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: a11y', () => {
  test('does not set a default aria-labelledby when there is not a neighboring ion-label', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent('<ion-input></ion-input>');

    const input = page.locator('ion-input > input');
    const ariaLabelledBy = await input.getAttribute('aria-labelledby');

    await expect(ariaLabelledBy).toBe(null);
  });

  test('set a default aria-labelledby when a neighboring ion-label exists', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(
      `
        <ion-item>
          <ion-label>A11y Test</ion-label>
          <ion-input></ion-input>
        </ion-item>
      `
    );

    const label = page.locator('ion-label');
    const input = page.locator('ion-input > input');

    const ariaLabelledBy = await input.getAttribute('aria-labelledby');
    const labelId = await label.getAttribute('id');

    await expect(ariaLabelledBy).toBe(labelId);
  });
});
