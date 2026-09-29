import { test, expect } from '@playwright/test';
import { ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * Reproduces https://github.com/ionic-team/ionic-framework/issues/31157
 * (and the original https://github.com/ionic-team/ionic-framework/issues/19986).
 *
 * A parent passes state to a child rendered inside an IonRouterOutlet. Clicking the
 * button updates that state, and the child should re-render with the new value
 * ("Viktor" -> "another").
 */
test.describe('Props Update inside IonRouterOutlet', () => {
  test('routes wrapped in <Routes> should update child props on parent state change', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31157',
    });
    await page.goto(withTestingMode('/props-update-routes/child'));
    await ionPageVisible(page, 'props-update-child');

    const button = page.locator('[data-testid="name-button"]');
    await expect(button).toHaveText('Viktor');

    await button.click();
    await expect(button).toHaveText('another');
  });

  test('routes as direct children should update child props on parent state change', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/19986',
    });
    await page.goto(withTestingMode('/props-update-direct/child'));
    await ionPageVisible(page, 'props-update-child');

    const button = page.locator('[data-testid="name-button"]');
    await expect(button).toHaveText('Viktor');

    await button.click();
    await expect(button).toHaveText('another');
  });
});
