import { test, expect } from '@playwright/test';

import { ionSwipeToGoBack } from './utils/drag-utils';
import { ionBackClick, ionPageHidden, ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * A splat ("*") route can be a real container page, not just a 404. When a more
 * specific sibling route in the same outlet is pushed, the splat's page must stay
 * mounted behind it so back reveals the same page with its state intact.
 *
 * https://github.com/ionic-team/ionic-framework/issues/31477
 */
test.describe('splat route with a more specific sibling', () => {
  test('keeps the splat page mounted behind a pushed sibling', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto(withTestingMode('/splat-sibling'));
    await ionPageVisible(page, 'splat-sibling-home');

    await page.locator('[data-testid="open-detail"]').click();

    await ionPageVisible(page, 'splat-sibling-detail');
    await expect(page.locator('[data-testid="detail-id"]')).toHaveText('12');
    await ionPageHidden(page, 'splat-sibling-home');
  });

  test('restores the same splat page with its state on back', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto(withTestingMode('/splat-sibling'));
    await ionPageVisible(page, 'splat-sibling-home');

    await page.locator('[data-testid="increment"]').click();
    await page.locator('[data-testid="increment"]').click();
    await page.locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="count"]')).toHaveText('3');

    await page.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'splat-sibling-detail');

    await ionBackClick(page, 'splat-sibling-detail');

    await ionPageVisible(page, 'splat-sibling-home');
    await expect(page.locator('[data-testid="count"]')).toHaveText('3');
  });

  // Animations stay on here, so the gesture reveals the page underneath rather than a
  // commit doing it.
  test('reveals the splat page while swiping back', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto('/splat-sibling?ionic:mode=ios');
    await ionPageVisible(page, 'splat-sibling-home');

    await page.locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');

    await page.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'splat-sibling-detail');
    // ionPageHidden resolves early here, because the deactivation scan applies
    // ion-page-hidden at render time rather than on commit, so wait out the push
    // transition before starting the gesture.
    await ionPageHidden(page, 'splat-sibling-home');
    await page.waitForTimeout(600);

    await ionSwipeToGoBack(page, true, 'ion-router-outlet#splat-sibling-outlet');

    await ionPageVisible(page, 'splat-sibling-home');
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');
  });
});
