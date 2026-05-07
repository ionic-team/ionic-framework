import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input password toggle: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
          <main>
            <ion-input label="input" type="password">
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
            </ion-input>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe(title('input password toggle: aria attributes'), () => {
    test('should have correct aria attributes on load', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="input" type="password">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      `,
        config
      );

      const nativeButton = page.locator('ion-input-password-toggle button');

      await expect(nativeButton).toHaveAttribute('aria-label', 'Show password');
      await expect(nativeButton).toHaveAttribute('aria-pressed', 'false');
    });
    test('should update aria attributes after toggle', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="input" type="password">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      `,
        config
      );

      const nativeButton = page.locator('ion-input-password-toggle button');
      await nativeButton.click();

      await expect(nativeButton).toHaveAttribute('aria-label', 'Hide password');
      await expect(nativeButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
