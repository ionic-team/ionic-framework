import { test, expect } from '@playwright/test';

test.describe('Modals: Inline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/modal');
  });

  /*
   * Pins the one behavior that distinguishes `nullableBooleanAttribute` from Angular's
   * `booleanAttribute`. Attribute presence, `'false'` and an absent attribute all behave
   * the same under either, because Stencil coerces them itself.
   */
  test('should leave an undefined boolean input as undefined', async ({ page }) => {
    await expect(page.locator('ion-modal')).toHaveJSProperty('focusTrap', undefined);
  });

  test('should render modal', async ({ page }) => {
    await page.locator('button#open-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('ion-modal #modal-content')).toBeVisible();
  });
});
