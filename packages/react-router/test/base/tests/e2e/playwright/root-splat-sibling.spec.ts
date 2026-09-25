import { test, expect } from '@playwright/test';

import { ionSwipeToGoBack } from './utils/drag-utils';
import { ionBackClick, ionPageHidden, ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * A splat route can be the outlet's container page rather than a 404. When a more specific
 * sibling is pushed over it, the container must stay mounted behind so back reveals the same
 * page with its state intact. splat-sibling.spec.ts covers that one level down; this covers
 * it in the root outlet, which is served under its own basename.
 *
 * https://github.com/ionic-team/ionic-framework/issues/31477
 */
test.describe('root splat route with a more specific sibling', () => {
  test('keeps the root splat tabs mounted behind a pushed sibling', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto(withTestingMode('/root-splat-sibling/feed'));
    await ionPageVisible(page, 'root-splat-sibling-tabs');
    await ionPageVisible(page, 'root-splat-sibling-feed');

    await page.locator('[data-testid="open-detail"]').click();

    await ionPageVisible(page, 'root-splat-sibling-detail');
    await expect(page.locator('[data-testid="detail-id"]')).toHaveText('12');

    // The tabs are the page underneath, so they stay in the DOM and are just hidden.
    await ionPageHidden(page, 'root-splat-sibling-tabs');
    await expect(page.locator('ion-tabs')).toHaveCount(1);
  });

  test('reveals the same tabs page with its state on back', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto(withTestingMode('/root-splat-sibling/feed'));
    await ionPageVisible(page, 'root-splat-sibling-feed');

    const tabsPage = page.locator('div.ion-page[data-pageid="root-splat-sibling-tabs"]');
    // Pins the default spelling, so inverting the ternary fails here and not only in the bare test.
    await expect(tabsPage).toHaveAttribute('data-splat', '/*');
    const originalInstance = await tabsPage.getAttribute('data-instance');

    await page.locator('[data-testid="increment"]').click();
    await page.locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="count"]')).toHaveText('2');

    await page.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'root-splat-sibling-detail');

    await ionBackClick(page, 'root-splat-sibling-detail');

    await ionPageVisible(page, 'root-splat-sibling-tabs');
    await ionPageVisible(page, 'root-splat-sibling-feed');
    // A replacement page would carry a fresh instance id and a counter back at 0.
    await expect(tabsPage).toHaveAttribute('data-instance', originalInstance!);
    await expect(page.locator('[data-testid="count"]')).toHaveText('2');
  });

  // Animations stay on here, so the gesture reveals the page underneath rather than a
  // commit doing it.
  test('reveals the tabs page while swiping back', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto('/root-splat-sibling/feed?ionic:mode=ios');
    await ionPageVisible(page, 'root-splat-sibling-feed');

    await page.locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');

    await page.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'root-splat-sibling-detail');
    // ionPageHidden resolves early here, because the deactivation scan applies
    // ion-page-hidden at render time rather than on commit, so wait out the push
    // transition before starting the gesture.
    await ionPageHidden(page, 'root-splat-sibling-tabs');
    await page.waitForTimeout(600);

    await ionSwipeToGoBack(page, true, 'ion-router-outlet#root-splat-sibling-outlet');

    await ionPageVisible(page, 'root-splat-sibling-tabs');
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');
  });

  // A bare "*" fails differently from "/*", so run the same flows against both spellings.
  test('keeps a bare "*" container mounted and restores it on back', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto(withTestingMode('/root-splat-sibling/feed?splat=bare'));
    await ionPageVisible(page, 'root-splat-sibling-feed');

    const tabsPage = page.locator('div.ion-page[data-pageid="root-splat-sibling-tabs"]');
    // The query param is the only thing selecting the bare spelling, and navigation drops it.
    await expect(tabsPage).toHaveAttribute('data-splat', '*');
    const originalInstance = await tabsPage.getAttribute('data-instance');

    await page.locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');

    await page.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'root-splat-sibling-detail');
    await ionPageHidden(page, 'root-splat-sibling-tabs');

    await ionBackClick(page, 'root-splat-sibling-detail');

    await ionPageVisible(page, 'root-splat-sibling-tabs');
    await expect(tabsPage).toHaveAttribute('data-instance', originalInstance!);
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');
  });

  // Revealing the container isn't enough on its own, the tabs underneath have to still
  // route after back.
  test('leaves the revealed container routable through its tab bar', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31477',
    });

    await page.goto(withTestingMode('/root-splat-sibling/feed'));
    await ionPageVisible(page, 'root-splat-sibling-feed');

    await page.locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');

    await page.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'root-splat-sibling-detail');

    await ionBackClick(page, 'root-splat-sibling-detail');
    await ionPageVisible(page, 'root-splat-sibling-feed');

    await page.locator('[data-testid="tab-profile"]').click();
    await ionPageVisible(page, 'root-splat-sibling-profile');
    await expect(page.locator('[data-testid="profile-content"]')).toBeVisible();

    await page.locator('[data-testid="tab-feed"]').click();
    await ionPageVisible(page, 'root-splat-sibling-feed');
    // Tabs keep their pages mounted, so the counter survives the round trip too.
    await expect(page.locator('[data-testid="count"]')).toHaveText('1');
  });
});
