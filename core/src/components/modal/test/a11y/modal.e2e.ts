import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: a11y', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');
    await page.goto(`/src/components/modal/test/a11y`);
  });

  test('should not have accessibility violations', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const button = page.locator('#open-modal');

    await button.click();
    await ionModalDidPresent.next();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should set default aria attributes', async ({ page }) => {
    const modal = page.locator('ion-modal');

    await expect(modal).toHaveAttribute('aria-label', 'modal');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('role', 'dialog');
  });

  test('should allow for custom aria attributes', async ({ page }) => {
    await page.setContent(`
      <ion-modal aria-label="my custom label">My content</ion-modal>
    `);
    const modal = page.locator('ion-modal');
    await expect(modal).toHaveAttribute('aria-label', 'my custom label');
  });
});
