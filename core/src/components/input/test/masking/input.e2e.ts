import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('input: masking', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/input/test/masking', config);
    });

    test(title('should filter out spaces'), async ({ page }) => {
      const ionInput = await page.spyOnEvent('ionInput');
      const input = page.locator('#inputTrimmed');

      await input.click();

      // Playwright types this in one character at a time.
      await page.keyboard.type('A B C', { delay: 100 });
      await ionInput.next();

      // ionInput is called for each character.
      await expect(ionInput).toHaveReceivedEventTimes(5);
      await expect(input).toHaveJSProperty('value', 'ABC');
    });
  });
});
