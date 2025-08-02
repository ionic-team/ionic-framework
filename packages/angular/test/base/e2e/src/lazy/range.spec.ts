import { test, expect } from '@playwright/test';

test.describe('Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/form-controls/range');
  });

  test('should have form control initial value', async ({ page }) => {
    await expect(page.locator('ion-range input')).toHaveValue('5');
  });

  test('should reflect Ionic form control status classes', async ({ page }) => {
    // Control is initially invalid
    await expect(page.locator('ion-range')).toHaveClass(/ion-invalid/);
    await expect(page.locator('ion-range')).toHaveClass(/ion-pristine/);
    await expect(page.locator('ion-range')).toHaveClass(/ion-untouched/);

    // Focus the range knob and use keyboard to increment the value
    const knob = page.locator('ion-range').locator('.range-knob-handle');
    await knob.click();
    await knob.focus();

    // Press right arrow 5 times to go from 5 to 10
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowRight');
    }

    await expect(page.locator('ion-range')).toHaveClass(/ion-dirty/);

    // Trigger blur to set the touched state
    await page.locator('ion-range').blur();

    await expect(page.locator('ion-range')).toHaveClass(/ion-touched/);
    await expect(page.locator('ion-range input')).toHaveValue('10');
  });
});
