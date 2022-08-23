import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

const testAriaLabel = async (page: E2EPage, buttonID: string, expectedAriaLabel: string) => {
  const button = page.locator(`#${buttonID}`);
  await button.click();

  const alert = page.locator('ion-alert');
  await expect(alert).toHaveAttribute('aria-label', expectedAriaLabel);
};

test.describe('alert: a11y', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    await page.goto(`/src/components/alert/test/a11y`);
  });

  test('should not have accessibility violations', async ({ page }) => {
    const button = page.locator('#customHeader');
    await button.click();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have fallback aria-label when no header or subheader is specified', async ({ page }) => {
    await testAriaLabel(page, 'noHeader', 'Alert');
  });

  test('should inherit aria-label from header', async ({ page }) => {
    await testAriaLabel(page, 'customHeader', 'Header');
  });

  test('should inherit aria-label from subheader if no header is specified', async ({ page }) => {
    await testAriaLabel(page, 'subHeaderOnly', 'Subtitle');
  });

  test('should allow for manually specifying aria-label', async ({ page }) => {
    await testAriaLabel(page, 'customAriaLabel', 'Custom alert');
  });
});
