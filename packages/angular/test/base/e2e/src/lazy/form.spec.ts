import { test, expect } from '@playwright/test';

test.describe('Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/form');
  });

  test.describe('status updates', () => {
    test('should update Ionic form classes when calling form methods programmatically', async ({ page }) => {
      await page.locator('#input-touched').click();
      await expect(page.locator('#touched-input-test')).toHaveClass(/ion-touched/);
      await page.locator('#input-otp-touched').click();
      await expect(page.locator('#touched-input-otp-number-test')).toHaveClass(/ion-touched/);
    });

    test('markAllAsTouched should apply .ion-touched to nearest ion-item', async ({ page }) => {
      await page.locator('#mark-all-touched-button').click();
      const items = page.locator('form ion-item');
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        await expect(items.nth(i)).toHaveClass(/ion-touched/);
      }
    });
  });

  test.describe('change', () => {
    test('should have default values', async ({ page }) => {
      await testStatus(page, 'INVALID');
      await expect(page.locator('#submit')).toHaveText('false');
      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: false,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: null,
        inputOtpText: '',
        inputOtp2: 1234,
        checkbox: false,
        radio: null
      });
    });

    test('should become valid', async ({ page }) => {
      await page.locator('ion-input.required input').fill('Some value');
      await page.locator('ion-input.required input').blur();

      await page.locator('ion-textarea.required textarea').fill('Some value');
      await page.locator('ion-textarea.required textarea').blur();

      // Test number OTP input
      await page.locator('#touched-input-otp-number-test input').nth(0).fill('5');
      await page.locator('#touched-input-otp-number-test input').nth(1).fill('6');
      await page.locator('#touched-input-otp-number-test input').nth(2).fill('7');
      await page.locator('#touched-input-otp-number-test input').nth(3).fill('8');
      await page.locator('#touched-input-otp-number-test input').last().focus();
      await page.locator('#touched-input-otp-number-test input').last().blur();

      // Test text OTP input
      await page.locator('#touched-input-otp-text-test input').nth(0).fill('A');
      await page.locator('#touched-input-otp-text-test input').nth(1).fill('B');
      await page.locator('#touched-input-otp-text-test input').nth(2).fill('C');
      await page.locator('#touched-input-otp-text-test input').nth(3).fill('D');
      await page.locator('#touched-input-otp-text-test input').last().focus();
      await page.locator('#touched-input-otp-text-test input').last().blur();

      await testStatus(page, 'INVALID');

      await page.locator('ion-select').click();
      await expect(page.locator('ion-alert')).toBeVisible();
      // NES option
      await page.locator('ion-alert .alert-radio-button').nth(1).click();
      // Click confirm button
      await page.locator('ion-alert .alert-button:not(.alert-button-role-cancel)').click();

      await testStatus(page, 'VALID');

      await testData(page, {
        datetime: '2010-08-20',
        select: 'nes',
        toggle: false,
        textarea: 'Some value',
        textarea2: 'Default Value',
        input: 'Some value',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: 5678,
        inputOtpText: 'ABCD',
        inputOtp2: 1234,
        checkbox: false,
        radio: null
      });
    });

    test('ion-toggle should change', async ({ page }) => {
      await page.locator('form ion-toggle').click();
      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: true,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: null,
        inputOtpText: '',
        inputOtp2: 1234,
        checkbox: false,
        radio: null
      });
    });

    test('ion-checkbox should change', async ({ page }) => {
      await page.locator('ion-checkbox').click();
      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: false,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: null,
        inputOtpText: '',
        inputOtp2: 1234,
        checkbox: true,
        radio: null
      });
    });

    test('ion-radio should change', async ({ page }) => {
      await page.locator('ion-radio').click();
      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: false,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: null,
        inputOtpText: '',
        inputOtp2: 1234,
        checkbox: false,
        radio: 'nes',
      });
    });

    test('ion-input-otp should change', async ({ page }) => {
      // Test number OTP input
      await page.locator('#touched-input-otp-number-test input').nth(0).fill('5');
      await page.locator('#touched-input-otp-number-test input').nth(1).fill('6');
      await page.locator('#touched-input-otp-number-test input').nth(2).fill('7');
      await page.locator('#touched-input-otp-number-test input').nth(3).fill('8');
      await page.locator('#touched-input-otp-number-test input').last().focus();
      await page.locator('#touched-input-otp-number-test input').last().blur();

      // Test text OTP input
      await page.locator('#touched-input-otp-text-test input').nth(0).fill('A');
      await page.locator('#touched-input-otp-text-test input').nth(1).fill('B');
      await page.locator('#touched-input-otp-text-test input').nth(2).fill('C');
      await page.locator('#touched-input-otp-text-test input').nth(3).fill('D');
      await page.locator('#touched-input-otp-text-test input').last().focus();
      await page.locator('#touched-input-otp-text-test input').last().blur();

      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: false,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: 5678,
        inputOtpText: 'ABCD',
        inputOtp2: 1234,
        checkbox: false,
        radio: null
      });
    });

    test('should submit', async ({ page }) => {
      await page.locator('#set-values').click();
      await page.locator('#submit-button').click();
      await expect(page.locator('#submit')).toHaveText('true');
    });

    test('ion-input-otp should validate both number and text types', async ({ page }) => {
      // Test number OTP validation
      await expect(page.locator('#touched-input-otp-number-test')).toHaveClass(/ng-invalid/);
      await page.locator('#touched-input-otp-number-test input').nth(0).fill('5');
      await page.locator('#touched-input-otp-number-test input').nth(1).fill('6');
      await page.locator('#touched-input-otp-number-test input').nth(2).fill('7');
      await page.locator('#touched-input-otp-number-test input').nth(3).fill('8');
      await page.locator('#touched-input-otp-number-test input').last().focus();
      await page.locator('#touched-input-otp-number-test input').last().blur();
      await expect(page.locator('#touched-input-otp-number-test')).toHaveClass(/ng-valid/);

      // Test text OTP validation
      await expect(page.locator('#touched-input-otp-text-test')).toHaveClass(/ng-invalid/);
      await page.locator('#touched-input-otp-text-test input').nth(0).fill('A');
      await page.locator('#touched-input-otp-text-test input').nth(1).fill('B');
      await page.locator('#touched-input-otp-text-test input').nth(2).fill('C');
      await page.locator('#touched-input-otp-text-test input').nth(3).fill('D');
      await page.locator('#touched-input-otp-text-test input').last().focus();
      await page.locator('#touched-input-otp-text-test input').last().blur();
      await expect(page.locator('#touched-input-otp-text-test')).toHaveClass(/ng-valid/);
    });

    test('ion-input-otp should remain invalid when partially filled', async ({ page }) => {
      // Test number OTP with only first digit
      await expect(page.locator('#touched-input-otp-number-test')).toHaveClass(/ng-invalid/);
      await page.locator('#touched-input-otp-number-test input').nth(0).fill('5');
      await page.locator('#touched-input-otp-number-test input').nth(1).focus();
      await page.locator('#touched-input-otp-number-test input').nth(1).blur();
      await expect(page.locator('#touched-input-otp-number-test')).toHaveClass(/ng-invalid/);

      // Test text OTP with only first character
      await expect(page.locator('#touched-input-otp-text-test')).toHaveClass(/ng-invalid/);
      await page.locator('#touched-input-otp-text-test input').nth(0).fill('A');
      await page.locator('#touched-input-otp-text-test input').nth(1).focus();
      await page.locator('#touched-input-otp-text-test input').nth(1).blur();
      await expect(page.locator('#touched-input-otp-text-test')).toHaveClass(/ng-invalid/);

      // Verify form status is still invalid
      await testStatus(page, 'INVALID');
    });
  });

  test.describe('blur', () => {
    test('ion-toggle should change only after blur', async ({ page }) => {
      await page.locator('form ion-toggle').click();
      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: true,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: null,
        inputOtpText: '',
        inputOtp2: 1234,
        checkbox: false,
        radio: null
      });
      await page.locator('ion-checkbox').click();
      await testData(page, {
        datetime: '2010-08-20',
        select: null,
        toggle: true,
        textarea: '',
        textarea2: 'Default Value',
        input: '',
        input2: 'Default Value',
        inputMin: 1,
        inputMax: 1,
        inputOtp: null,
        inputOtpText: '',
        inputOtp2: 1234,
        checkbox: true,
        radio: null
      });
    });
  });

  test.describe('validators', () => {
    test('ion-input should error with min set', async ({ page }) => {
      const control = page.locator('form ion-input[formControlName="inputMin"]');

      await expect(control).toHaveClass(/ng-valid/);

      await control.locator('input').fill('0');
      await control.locator('input').blur();

      await expect(control).toHaveClass(/ng-invalid/);
    });

    test('ion-input should error with max set', async ({ page }) => {
      const control = page.locator('form ion-input[formControlName="inputMax"]');

      await expect(control).toHaveClass(/ng-valid/);

      await control.locator('input').fill('2');
      await control.locator('input').blur();

      await expect(control).toHaveClass(/ng-invalid/);
    });
  });

  // Helper functions
  async function testStatus(page: any, status: string) {
    await expect(page.locator('#status')).toHaveText(status);
  }

  async function testData(page: any, data: any) {
    const text = await page.locator('#data').textContent();
    const value = JSON.parse(text!);
    expect(value).toEqual(data);
  }
});
