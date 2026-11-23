import { test, expect } from '@playwright/test';

/**
 * Ionic builds its status classes from the control state, so they must be
 * the same whether or not the app opts into Angular's `ng-*` classes.
 */
const pages = [
  { title: 'without NG_STATUS_CLASSES', path: '/standalone/version-test/signal-forms' },
  { title: 'with NG_STATUS_CLASSES', path: '/standalone/version-test/signal-forms-status-classes' },
];

for (const { title, path } of pages) {
  test.describe(`Signal Forms: ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('should show the error text after the form is marked as touched', async ({ page }) => {
      const name = page.locator('ion-input#name');

      await page.locator('ion-button#submit').click();

      await expect(name).toHaveClass(/\bion-touched\b/);
      await expect(name).toHaveClass(/\bion-invalid\b/);
      await expect(name.locator('.error-text')).toBeVisible();
    });

    test('should update validity when it changes from another field', async ({ page }) => {
      const confirm = page.locator('ion-input#confirm');

      await expect(confirm).toHaveClass(/\bion-valid\b/);

      await page.locator('ion-input#password input').fill('a');

      await expect(confirm).toHaveClass(/\bion-invalid\b/);

      await page.locator('ion-input#confirm input').fill('a');

      await expect(confirm).toHaveClass(/\bion-valid\b/);
    });

    test('should keep the status classes after more typing and another blur', async ({ page }) => {
      const name = page.locator('ion-input#name');
      const nativeInput = name.locator('input');

      await nativeInput.pressSequentially('ab');
      await nativeInput.blur();
      await nativeInput.focus();
      await nativeInput.blur();

      await expect(name).toHaveClass(/\bion-touched\b/);
      await expect(name).toHaveClass(/\bion-dirty\b/);
      await expect(name).toHaveClass(/\bion-valid\b/);
    });

    test('should keep the status classes when the model checks a checkbox or toggle', async ({ page }) => {
      const terms = page.locator('ion-checkbox#terms');
      const notifications = page.locator('ion-toggle#notifications');

      await page.locator('ion-button#submit').click();
      await expect(terms).toHaveClass(/\bion-touched\b/);
      await expect(notifications).toHaveClass(/\bion-touched\b/);

      await page.locator('ion-button#check-all').click();

      await expect(terms).toHaveJSProperty('checked', true);
      await expect(notifications).toHaveJSProperty('checked', true);
      await expect(terms).toHaveClass(/\bion-touched\b/);
      await expect(notifications).toHaveClass(/\bion-touched\b/);
    });

    test('should not mark a field as valid or invalid while async validation is pending', async ({ page }) => {
      const username = page.locator('ion-input#username');

      await expect(username).toHaveClass(/\bion-untouched\b/);
      await expect(username).not.toHaveClass(/\bion-valid\b/);
      await expect(username).not.toHaveClass(/\bion-invalid\b/);
    });
  });
}
