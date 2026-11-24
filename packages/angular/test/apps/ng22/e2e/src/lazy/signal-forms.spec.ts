import { test, expect } from '@playwright/test';

test.describe('Signal Forms: lazy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/version-test/signal-forms');
  });

  test('should show the error text after the form is marked as touched', async ({ page }) => {
    const name = page.locator('ion-input#name');

    await page.locator('ion-button#submit').click();

    await expect(name).toHaveClass(/\bion-touched\b/);
    await expect(name).toHaveClass(/\bion-invalid\b/);
    await expect(name.locator('.error-text')).toBeVisible();
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
});
