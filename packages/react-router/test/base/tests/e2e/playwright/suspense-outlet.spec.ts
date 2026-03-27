import { test, expect } from '@playwright/test';
import { ionPageVisible, ionBackClick, withTestingMode } from './utils/test-utils';

test.describe('Suspense outlet', () => {
  // The "Maximum update depth exceeded" crash only manifests in React 19 where
  // reappearLayoutEffects re-runs componentDidMount without a preceding componentWillUnmount.
  // React 18 unmounts/remounts suspended content, so these tests verify behavioral outcomes only.
  // Repro: https://github.com/ptmkenny/ionic-react-router-6-test/tree/404-issue

  test('should render content index inside Suspense-wrapped outlet', async ({ page }) => {
    await page.goto(withTestingMode('/suspense-outlet/content'));
    await ionPageVisible(page, 'content-index');
  });

  test('should navigate to a known item inside Suspense-wrapped outlet', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto(withTestingMode('/suspense-outlet/content'));
    await ionPageVisible(page, 'content-index');

    await page.locator('[data-testid="go-to-item-1"]').click();
    await ionPageVisible(page, 'item-page');
    await expect(page.locator('[data-testid="item-id"]')).toContainText('item-1');

    const maxUpdateError = pageErrors.find((e) => e.message.includes('Maximum update depth exceeded'));
    expect(maxUpdateError, 'Should not throw "Maximum update depth exceeded"').toBeUndefined();
  });

  test('should navigate to an unknown item and show error page without crashing', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto(withTestingMode('/suspense-outlet/content'));
    await ionPageVisible(page, 'content-index');

    await page.locator('[data-testid="go-to-not-found"]').click();
    await ionPageVisible(page, 'item-error-page');
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Item not found: not-found-item');

    const maxUpdateError = pageErrors.find((e) => e.message.includes('Maximum update depth exceeded'));
    expect(maxUpdateError, 'Should not throw "Maximum update depth exceeded"').toBeUndefined();
  });

  test('should navigate back from error page to content index', async ({ page }) => {
    await page.goto(withTestingMode('/suspense-outlet/content'));
    await ionPageVisible(page, 'content-index');

    await page.locator('[data-testid="go-to-not-found"]').click();
    await ionPageVisible(page, 'item-error-page');

    await ionBackClick(page, 'item-error-page');
    await ionPageVisible(page, 'content-index');
  });

  test('should direct-link to not-found item page without crashing', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Direct navigation to the not-found URL (no prior history)
    await page.goto(withTestingMode('/suspense-outlet/content/items/not-found-item'));
    await ionPageVisible(page, 'item-error-page');
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Item not found: not-found-item');

    const maxUpdateError = pageErrors.find((e) => e.message.includes('Maximum update depth exceeded'));
    expect(maxUpdateError, 'Should not throw "Maximum update depth exceeded"').toBeUndefined();
  });
});
