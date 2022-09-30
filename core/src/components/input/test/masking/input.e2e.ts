import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: masking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/input/test/masking');
  });

  test('should filter out spaces', async ({ page, skip }) => {
    skip.rtl();

    const ionInput = await page.spyOnEvent('ionInput');
    const input = page.locator('#inputTrimmed');

    await input.click();

    // Playwright types this in one character at a time.
    await page.keyboard.type('S p a c e s');
    await ionInput.next();

    // ionInput is called for each character.
    await expect(ionInput).toHaveReceivedEventTimes(11);
    await expect(input).toHaveJSProperty('value', 'Spaces');
  });
});
