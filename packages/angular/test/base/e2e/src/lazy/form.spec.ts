import { test, expect } from '@playwright/test';

test.describe('Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/form');
  });

  test('should have form control initial value', async ({ page }) => {
    await expect(page.locator('ion-input.required input')).toHaveValue('');
  });

  test('should reflect Ionic form control status classes', async ({ page }) => {
    // Control is initially invalid
    await expect(page.locator('ion-input.required')).toHaveClass(/ion-invalid/);
    await expect(page.locator('ion-input.required')).toHaveClass(/ion-pristine/);
    await expect(page.locator('ion-input.required')).toHaveClass(/ion-untouched/);

    // Fill the input to make it valid
    await page.locator('ion-input.required input').fill('Some value');
    await page.locator('ion-input.required input').blur();

    await expect(page.locator('ion-input.required')).toHaveClass(/ion-valid/);
    await expect(page.locator('ion-input.required')).toHaveClass(/ion-dirty/);
    await expect(page.locator('ion-input.required')).toHaveClass(/ion-touched/);
  });

  test('should become valid when filled', async ({ page }) => {
    await page.locator('ion-input.required input').fill('Some value');
    await page.locator('ion-input.required input').blur();

    // Test number OTP input
    await page.locator('ion-input-otp input').nth(0).fill('1');
    await page.locator('ion-input-otp input').nth(1).fill('2');
    await page.locator('ion-input-otp input').nth(2).fill('3');
    await page.locator('ion-input-otp input').nth(3).fill('4');

    // Check that the OTP input is valid
    await expect(page.locator('#touched-input-otp-number-test')).toHaveClass(/ion-valid/);
  });

  test('ion-input should error with min set', async ({ page }) => {
    const control = page.locator('form ion-input[formControlName="inputMin"]');

    // Control is initially valid
    await expect(control).toHaveClass(/ng-valid/);

    await control.locator('input').fill('0');
    await control.locator('input').blur();

    await expect(control).toHaveClass(/ng-invalid/);
  });

  test('ion-input should error with max set', async ({ page }) => {
    const control = page.locator('form ion-input[formControlName="inputMax"]');

    // Control is initially valid
    await expect(control).toHaveClass(/ng-valid/);

    await control.locator('input').fill('2');
    await control.locator('input').blur();

    await expect(control).toHaveClass(/ng-invalid/);
  });
});
