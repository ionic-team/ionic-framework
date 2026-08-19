import { test, expect } from '@playwright/test';

import { ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * `<IonButton disabled={false}>` must not leave a `disabled="false"` attribute
 * on the host. ion-button is routing-wrapped (createRoutingComponent), so this
 * is the real end-to-end check with an actual @ionic/react component.
 */
test.describe('IonButton disabled boolean attribute', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(withTestingMode('/disabled-button'));
    await ionPageVisible(page, 'disabled-button');
  });

  test('disabled={false} should not render a disabled attribute', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/27930',
    });

    const button = page.locator('#btn-false');
    await expect(button).toHaveJSProperty('disabled', false);
    await expect(button).not.toHaveAttribute('disabled', /.*/);
    // The inner native button must be interactive.
    await expect(button.locator('button')).not.toBeDisabled();
  });

  test('disabled={true} should render a disabled, non-interactive button', async ({ page }) => {
    const button = page.locator('#btn-true');
    await expect(button).toHaveJSProperty('disabled', true);
    await expect(button).toHaveAttribute('disabled', '');
    await expect(button.locator('button')).toBeDisabled();
  });

  test('aria-expanded={false} should be preserved (meaningful, not a boolean attribute)', async ({ page }) => {
    // ion-button relocates aria-* from the host onto its inner native button, so
    // the wrapper must NOT strip aria-expanded="false" (unlike disabled="false"):
    // it has to survive on the host long enough to be inherited here.
    const nativeButton = page.locator('#btn-aria button');
    await expect(nativeButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('toggling disabled false -> true should disable the button', async ({ page }) => {
    const button = page.locator('#btn-toggle');
    await expect(button).not.toHaveAttribute('disabled', /.*/);

    await page.locator('#btn-do-toggle').click();

    await expect(button).toHaveAttribute('disabled', '');
    await expect(button).toHaveJSProperty('disabled', true);
  });
});
