import { test, expect } from '@playwright/test';

test.describe('Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/inputs');
  });

  test('should have default values', async ({ page }) => {
    // Check primary elements for default values
    await expect(page.locator('ion-checkbox').first()).toHaveJSProperty('checked', true);
    await expect(page.locator('ion-radio-group').first()).toHaveJSProperty('value', 'nes');
    await expect(page.locator('ion-toggle').first()).toHaveJSProperty('checked', true);
    await expect(page.locator('ion-input').first()).toHaveJSProperty('value', 'some text');
    await expect(page.locator('ion-input-otp').first()).toHaveJSProperty('value', '1234');
    await expect(page.locator('ion-datetime').first()).toHaveJSProperty('value', '1994-03-15');
    await expect(page.locator('ion-select').first()).toHaveJSProperty('value', 'nes');
    await expect(page.locator('ion-range').first()).toHaveJSProperty('value', 50);
  });

  test('should reset values', async ({ page }) => {
    await page.locator('#reset-button').click();

    // Check primary elements after reset
    await expect(page.locator('ion-checkbox').first()).toHaveJSProperty('checked', false);
    await expect(page.locator('ion-radio-group').first()).toHaveJSProperty('value', undefined);
    await expect(page.locator('ion-toggle').first()).toHaveJSProperty('checked', false);
    /**
     * The `value` property gets set to undefined
     * for these components, so we need to check
     * that the value property is undefined.
     */
    await expect(page.locator('ion-input').first()).toHaveJSProperty('value', undefined);
    await expect(page.locator('ion-input-otp').first()).toHaveJSProperty('value', undefined);
    await expect(page.locator('ion-datetime').first()).toHaveJSProperty('value', undefined);
    await expect(page.locator('ion-select').first()).toHaveJSProperty('value', undefined);
    await expect(page.locator('ion-range').first()).toHaveJSProperty('value', undefined);
  });

  test('should set values', async ({ page }) => {
    await page.locator('#reset-button').click();
    await page.locator('#set-button').click();

    // Check primary elements after setting values
    await expect(page.locator('ion-checkbox').first()).toHaveJSProperty('checked', true);
    await expect(page.locator('ion-radio-group').first()).toHaveJSProperty('value', 'nes');
    await expect(page.locator('ion-toggle').first()).toHaveJSProperty('checked', true);
    await expect(page.locator('ion-input').first()).toHaveJSProperty('value', 'some text');
    await expect(page.locator('ion-input-otp').first()).toHaveJSProperty('value', '1234');
    await expect(page.locator('ion-datetime').first()).toHaveJSProperty('value', '1994-03-15');
    await expect(page.locator('ion-select').first()).toHaveJSProperty('value', 'nes');
    await expect(page.locator('ion-range').first()).toHaveJSProperty('value', 50);
  });

  test('should update angular when values change', async ({ page }) => {
    await page.locator('#reset-button').click();

    await page.locator('ion-checkbox#first-checkbox').click();
    await page.locator('ion-radio').first().click();
    await page.locator('ion-toggle').first().click();

    await page.locator('ion-input').nth(0).locator('input').fill('hola');
    await page.locator('ion-input').nth(0).locator('input').blur();

    await page.locator('ion-input-otp input').nth(0).fill('1');
    await page.locator('ion-input-otp input').nth(1).fill('2');
    await page.locator('ion-input-otp input').nth(2).fill('3');
    await page.locator('ion-input-otp input').nth(3).fill('4');
    await page.locator('ion-input-otp input').nth(3).blur();

    // Set date to 1994-03-14
    await page.locator('ion-datetime').first().click();
    await page.locator('ion-datetime').first().locator('.calendar-day:not([disabled])').first().click();

    await page.locator('ion-select#game-console').click();
    await expect(page.locator('ion-alert')).toBeVisible();
    // Playstation option
    await page.locator('ion-alert .alert-radio-button').nth(3).click();
    // Click confirm button
    await page.locator('ion-alert .alert-button:not(.alert-button-role-cancel)').click();

    // Check note text (Angular binding updates)
    await expect(page.locator('#checkbox-note')).toHaveText('true');
    await expect(page.locator('#radio-note')).toHaveText('nes');
    await expect(page.locator('#toggle-note')).toHaveText('true');
    await expect(page.locator('#input-note')).toHaveText('hola');
    await expect(page.locator('#input-otp-note')).toHaveText('1234');
    await expect(page.locator('#datetime-note')).toHaveText('1994-03-14');
    await expect(page.locator('#select-note')).toHaveText('ps');
  });

  test('should update values when erasing input', async ({ page }) => {
    // Focus the input and use global keyboard to press backspace
    await page.locator('ion-input').nth(0).locator('input').focus();
    await page.keyboard.press('Backspace');
    // Check mirror element reflects the change
    await expect(page.locator('ion-input').nth(1)).toHaveJSProperty('value', 'some tex');
    // Check note text (Angular binding)
    await expect(page.locator('#input-note')).toHaveText('some tex');

    // Focus the last OTP input and use global keyboard to press backspace
    await page.locator('ion-input-otp input').last().focus();
    await page.keyboard.press('Backspace');
    // Check mirror element reflects the change
    await expect(page.locator('ion-input-otp').nth(1)).toHaveJSProperty('value', '123');
    // Check note text (Angular binding)
    await expect(page.locator('#input-otp-note')).toHaveText('123');
  });

  test.describe('updating text input refs', () => {
    test('typing into input should update ref', async ({ page }) => {
      await page.locator('ion-input').first().locator('input').fill('Hello Input');
      // Check mirror element reflects the change
      await expect(page.locator('ion-input').nth(1)).toHaveJSProperty('value', 'Hello Input');
      // Check note text (Angular binding)
      await expect(page.locator('#input-note')).toHaveText('Hello Input');
    });

    test('typing into input-otp should update ref', async ({ page }) => {
      await page.locator('ion-input-otp input').nth(0).fill('1');
      await page.locator('ion-input-otp input').nth(1).fill('2');
      await page.locator('ion-input-otp input').nth(2).fill('3');
      await page.locator('ion-input-otp input').nth(3).fill('4');
      // Check mirror element reflects the change
      await expect(page.locator('ion-input-otp').nth(1)).toHaveJSProperty('value', '1234');
      // Check note text (Angular binding)
      await expect(page.locator('#input-otp-note')).toHaveText('1234');
    });
  });
});
