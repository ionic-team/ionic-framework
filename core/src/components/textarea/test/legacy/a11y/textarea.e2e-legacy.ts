import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: a11y', () => {
  test('does not set a default aria-labelledby when there is not a neighboring ion-label', async ({ page }) => {
    await page.setContent(`<ion-textarea></ion-textarea>`);

    await page.setIonViewport();

    const textarea = page.locator('ion-textarea textarea');
    const ariaLabelledBy = await textarea.getAttribute('aria-labelledby');

    expect(ariaLabelledBy).toBe(null);
  });

  test('set a default aria-labelledby when a neighboring ion-label exist', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-label>A11y Test</ion-label>
        <ion-textarea></ion-textarea>
      </ion-item>
    `);

    const label = page.locator('ion-label');
    const textarea = page.locator('ion-textarea textarea');
    const ariaLabelledBy = await textarea.getAttribute('aria-labelledby');

    expect(ariaLabelledBy).toBe(await label.getAttribute('id'));
  });
});
