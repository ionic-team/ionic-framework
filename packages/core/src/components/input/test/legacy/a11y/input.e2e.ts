import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: a11y'), () => {
    test('does not set a default aria-labelledby when there is not a neighboring ion-label', async ({ page }) => {
      await page.setContent('<ion-input legacy="true"></ion-input>', config);

      const input = page.locator('ion-input > input');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      await expect(ariaLabelledBy).toBe(null);
    });

    test('set a default aria-labelledby when a neighboring ion-label exists', async ({ page }) => {
      await page.setContent(
        `
          <ion-item>
            <ion-label>A11y Test</ion-label>
            <ion-input></ion-input>
          </ion-item>
        `,
        config
      );

      const label = page.locator('ion-label');
      const input = page.locator('ion-input > input');

      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const labelId = await label.getAttribute('id');

      await expect(ariaLabelledBy).toBe(labelId);
    });
  });
});
