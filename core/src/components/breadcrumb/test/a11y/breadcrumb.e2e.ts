import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumb: axe', () => {
  test('collapsed indicator should have an aria-label', async ({ page }) => {
    /**
     * `showCollapsedIndicator` is an internal API used by `ion-breadcrumbs`.
     * This test makes use of it to render the collapsed indicator.
     */
    await page.setContent(`<ion-breadcrumb show-collapsed-indicator="true">Text</ion-breadcrumb>`);

    const collapsedIndicator = page.locator('.breadcrumbs-collapsed-indicator');

    expect(await collapsedIndicator.getAttribute('aria-label')).toBe('Show more breadcrumbs');
  });
});
