import { test, expect } from '@playwright/test';

test.describe('Value Accessors', () => {
  test.describe('Checkbox', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/checkbox');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ checkbox: false }, null, 2));
      await expect(page.locator('ion-checkbox')).toHaveClass(/ion-pristine/);

      await page.locator('ion-checkbox').click();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ checkbox: true }, null, 2));
      await expect(page.locator('ion-checkbox')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-checkbox')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Input', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/input');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({
        inputString: '',
        inputNumber: ''
      }, null, 2));
      await expect(page.locator('ion-input[formControlName="inputString"]')).toHaveClass(/ion-pristine/);
      await expect(page.locator('ion-input[formControlName="inputNumber"]')).toHaveClass(/ion-pristine/);

      await expect(page.locator('ion-input[formControlName="inputString"]')).toHaveClass(/ion-invalid/);
      await expect(page.locator('ion-input[formControlName="inputNumber"]')).toHaveClass(/ion-invalid/);

      await page.locator('ion-input[formControlName="inputString"] input').fill('test');
      await page.locator('ion-input[formControlName="inputString"] input').blur();

      await page.locator('ion-input[formControlName="inputNumber"] input').fill('1');
      await page.locator('ion-input[formControlName="inputNumber"] input').blur();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({
        inputString: 'test',
        inputNumber: 1
      }, null, 2));

      await expect(page.locator('ion-input[formControlName="inputString"]')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-input[formControlName="inputNumber"]')).toHaveClass(/ion-dirty/);

      await expect(page.locator('ion-input[formControlName="inputString"]')).toHaveClass(/ion-valid/);
      await expect(page.locator('ion-input[formControlName="inputNumber"]')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Radio Group', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/radio-group');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ radioGroup: '1' }, null, 2));
      await expect(page.locator('ion-radio-group')).toHaveClass(/ion-pristine/);

      await page.locator('ion-radio').filter({ hasText: 'Two' }).click();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ radioGroup: '2' }, null, 2));
      await expect(page.locator('ion-radio-group')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-radio-group')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Searchbar', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/searchbar');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ searchbar: '' }, null, 2));
      await expect(page.locator('ion-searchbar')).toHaveClass(/ion-pristine/);
      await expect(page.locator('ion-searchbar')).toHaveClass(/ion-invalid/);

      await page.locator('ion-searchbar input').fill('test');
      await page.locator('ion-searchbar input').blur();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ searchbar: 'test' }, null, 2));
      await expect(page.locator('ion-searchbar')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-searchbar')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Segment', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/segment');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ segment: 'Paid' }, null, 2));
      await expect(page.locator('ion-segment')).toHaveClass(/ion-pristine/);

      await page.locator('ion-segment-button').nth(1).click();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ segment: 'Free' }, null, 2));
      await expect(page.locator('ion-segment')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-segment')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Select', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/select');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ select: 'bananas' }, null, 2));
      await expect(page.locator('ion-select')).toHaveClass(/ion-pristine/);

      await page.locator('ion-select').click();
      await expect(page.locator('ion-popover')).toBeVisible();

      await page.locator('ion-popover ion-radio-group ion-radio').first().click();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ select: 'apples' }, null, 2));
      await expect(page.locator('ion-select')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-select')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Textarea', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/textarea');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ textarea: '' }, null, 2));
      await expect(page.locator('ion-textarea')).toHaveClass(/ion-pristine/);
      await expect(page.locator('ion-textarea')).toHaveClass(/ion-invalid/);

      await page.locator('ion-textarea').click();
      await page.locator('ion-textarea textarea').fill('test');

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ textarea: 'test' }, null, 2));
      await expect(page.locator('ion-textarea')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-textarea')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Toggle', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/toggle');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ toggle: false }, null, 2));
      await expect(page.locator('ion-toggle')).toHaveClass(/ion-pristine/);

      await page.locator('ion-toggle').click();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({ toggle: true }, null, 2));
      await expect(page.locator('ion-toggle')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-toggle')).toHaveClass(/ion-valid/);
    });
  });

  test.describe('Input OTP', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/value-accessors/input-otp');
    });

    test('should update the form value', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({
        inputOtpString: '',
        inputOtpNumber: ''
      }, null, 2));
      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-pristine/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-pristine/);

      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-invalid/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-invalid/);

      // Type into the string OTP input
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(0).fill('a');
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(1).fill('b');
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(2).fill('c');
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(3).fill('d');
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(3).blur();

      // Type into the number OTP input
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(0).fill('1');
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(1).fill('2');
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(2).fill('3');
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(3).fill('4');
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(3).blur();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({
        inputOtpString: 'abcd',
        inputOtpNumber: 1234
      }, null, 2));

      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-dirty/);

      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-valid/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-valid/);
    });

    test('should remain invalid when partially filled', async ({ page }) => {
      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({
        inputOtpString: '',
        inputOtpNumber: ''
      }, null, 2));
      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-pristine/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-pristine/);

      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-invalid/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-invalid/);

      // Type only 2 characters into the string OTP input
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(0).fill('a');
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(1).fill('b');
      await page.locator('ion-input-otp[formControlName="inputOtpString"] input').nth(2).blur();

      // Type only 2 characters into the number OTP input
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(0).fill('1');
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(1).fill('2');
      await page.locator('ion-input-otp[formControlName="inputOtpNumber"] input').nth(2).blur();

      await expect(page.locator('#formValue')).toHaveText(JSON.stringify({
        inputOtpString: 'ab',
        inputOtpNumber: 12
      }, null, 2));

      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-dirty/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-dirty/);

      // Verify both inputs remain invalid when partially filled
      await expect(page.locator('ion-input-otp[formControlName="inputOtpString"]')).toHaveClass(/ion-invalid/);
      await expect(page.locator('ion-input-otp[formControlName="inputOtpNumber"]')).toHaveClass(/ion-invalid/);
    });
  });
});
