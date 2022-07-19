import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: masking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/input/test/masking');
  });

  test('should filter out spaces', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'Does not test LTR vs. RTL layout.');

    const input = page.locator('#inputTrimmed');

    await input.click();

    await page.keyboard.type('S p a c e s');

    await expect(input).toHaveJSProperty('value', 'Spaces');
  });
});
