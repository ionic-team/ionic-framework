import { test, expect } from '@playwright/test';

test.describe('Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/inputs');
  });

  test('should have default values', async ({ page }) => {
    await expect(page.locator('ion-checkbox').first()).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('ion-radio-group').first()).toHaveJSProperty('value', 'nes');
    await expect(page.locator('ion-toggle').first()).toHaveJSProperty('checked', true);
    await expect(page.locator('ion-input').first().locator('input')).toHaveValue('some text');
    await expect(page.locator('ion-input-otp').first()).toHaveJSProperty('value', '1234');
    await expect(page.locator('ion-range').first()).toHaveJSProperty('value', 50);
  });

  test('should reset values', async ({ page }) => {
    await page.locator('#reset-button').click();

    await expect(page.locator('ion-checkbox').first()).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('ion-radio-group').first()).toHaveJSProperty('value', undefined);
    await expect(page.locator('ion-toggle').first()).toHaveJSProperty('checked', false);
    await expect(page.locator('ion-input').first().locator('input')).toHaveValue('');
  });

  test('should set values', async ({ page }) => {
    await page.locator('#reset-button').click();
    await page.locator('#set-button').click();

    await expect(page.locator('ion-checkbox').first()).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('ion-radio-group').first()).toHaveJSProperty('value', 'nes');
    await expect(page.locator('ion-toggle').first()).toHaveJSProperty('checked', true);
    await expect(page.locator('ion-input').first().locator('input')).toHaveValue('some text');
  });

  test('should update angular when values change', async ({ page }) => {
    await page.locator('ion-checkbox').first().click();
    await page.locator('ion-toggle').first().click();

    await page.locator('ion-input').nth(0).locator('input').fill('hola');
    await page.locator('ion-input').nth(0).locator('input').blur();

    await page.locator('ion-input-otp input').nth(0).fill('1');
    await page.locator('ion-input-otp input').nth(1).fill('2');
    await page.locator('ion-input-otp input').nth(2).fill('3');
    await page.locator('ion-input-otp input').nth(3).fill('4');

    await expect(page.locator('#input-note')).toHaveText('hola');
    await expect(page.locator('#checkbox-note')).toHaveText('false');
    await expect(page.locator('#toggle-note')).toHaveText('false');
    await expect(page.locator('#input-otp-note')).toHaveText('1234');
  });

  test('should update values when erasing input', async ({ page }) => {
    await page.locator('ion-input').nth(0).locator('input').fill('some tex');
    await expect(page.locator('ion-input').nth(0).locator('input')).toHaveValue('some tex');
    await expect(page.locator('#input-note')).toHaveText('some tex');
  });

  test.describe('updating text input refs', () => {
    test('typing into input should update ref', async ({ page }) => {
      await page.locator('ion-input').first().locator('input').fill('Hello Input');
      await expect(page.locator('#input-note')).toHaveText('Hello Input');
    });

    test('typing into input-otp should update ref', async ({ page }) => {
      await page.locator('ion-input-otp input').nth(0).fill('1');
      await page.locator('ion-input-otp input').nth(1).fill('2');
      await page.locator('ion-input-otp input').nth(2).fill('3');
      await page.locator('ion-input-otp input').nth(3).fill('4');
      await expect(page.locator('#input-otp-note')).toHaveText('1234');
    });
  });
});
