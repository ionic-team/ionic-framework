import { test, expect } from '@playwright/test';

import { ionSwipeToGoBack } from './utils/drag-utils';
import { ionBackClick, ionPageDoesNotExist, ionPageHidden, ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * A replace must only unmount the page it replaces. Sibling pages (same parent
 * path) that are still in the back history must stay mounted, so going back
 * shows the same page with its state.
 *
 * https://github.com/ionic-team/ionic-framework/issues/31815
 */
test.describe('replace to a sibling route', () => {
  test('should keep the page that pushed the replaced page mounted', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });
    await page.goto(withTestingMode('/replace-sibling/home'));
    await ionPageVisible(page, 'replace-sibling-home');

    const home = page.locator('[data-pageid="replace-sibling-home"]');
    await home.locator('[data-testid="increment"]').click();
    await home.locator('[data-testid="increment"]').click();
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('2');
    const mountBefore = await home.locator('[data-testid="home-mount"]').textContent();

    await home.locator('[data-testid="open-new"]').click();
    await ionPageVisible(page, 'replace-sibling-new');

    await page.locator('[data-testid="save"]').click();
    await ionPageVisible(page, 'replace-sibling-list');
    await expect(page).toHaveURL(/\/replace-sibling\/list(\?|$)/);

    // Wait past the deferred unmount so a pending cleanup has run.
    await page.waitForTimeout(500);
    await ionPageDoesNotExist(page, 'replace-sibling-new');
    await ionPageHidden(page, 'replace-sibling-home');

    await ionBackClick(page, 'replace-sibling-list');
    await ionPageVisible(page, 'replace-sibling-home');
    await expect(page).toHaveURL(/\/replace-sibling\/home(\?|$)/);

    // Home is still in the back history, so back must show the same instance:
    // the mount id and the counter state both survive.
    await expect(home.locator('[data-testid="home-mount"]')).toHaveText(mountBefore!);
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('2');
  });

  test('should keep every sibling in the back history mounted, not just the previous page', async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });
    await page.goto(withTestingMode('/replace-sibling/home'));
    await ionPageVisible(page, 'replace-sibling-home');

    const home = page.locator('[data-pageid="replace-sibling-home"]');
    const detail = page.locator('[data-pageid="replace-sibling-detail"]');
    await home.locator('[data-testid="increment"]').click();
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
    const mountBefore = await home.locator('[data-testid="home-mount"]').textContent();

    await home.locator('[data-testid="open-detail"]').click();
    await ionPageVisible(page, 'replace-sibling-detail');

    await detail.locator('[data-testid="open-new"]').click();
    await ionPageVisible(page, 'replace-sibling-new');

    await page.locator('[data-testid="save"]').click();
    await ionPageVisible(page, 'replace-sibling-list');

    await page.waitForTimeout(500);
    await ionPageDoesNotExist(page, 'replace-sibling-new');
    await ionPageHidden(page, 'replace-sibling-detail');
    await ionPageHidden(page, 'replace-sibling-home');

    await ionBackClick(page, 'replace-sibling-list');
    await ionPageVisible(page, 'replace-sibling-detail');

    await ionBackClick(page, 'replace-sibling-detail');
    await ionPageVisible(page, 'replace-sibling-home');
    await expect(home.locator('[data-testid="home-mount"]')).toHaveText(mountBefore!);
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
  });

  test('should keep a parameterized sibling mounted while later params replace each other', async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });
    await page.goto(withTestingMode('/replace-sibling/lesson/7/content'));
    await ionPageVisible(page, 'replace-sibling-lesson-content');

    const lesson = page.locator('[data-pageid="replace-sibling-lesson-content"]');
    await lesson.locator('[data-testid="lesson-increment"]').click();
    await expect(lesson.locator('[data-testid="lesson-count"]')).toHaveText('1');
    const mountBefore = await lesson.locator('[data-testid="lesson-mount"]').textContent();

    await lesson.locator('[data-testid="start-quiz"]').click();
    await ionPageVisible(page, 'replace-sibling-lesson-quiz');

    // Each replaced question unmounts, so exactly one question is left after
    // each step. The array form waits out the moment both are in the DOM.
    const quiz = page.locator('[data-pageid="replace-sibling-lesson-quiz"]');
    const questionIds = quiz.locator('[data-testid="question-id"]');
    await quiz.locator('[data-testid="next-question"]').click();
    await expect(questionIds).toHaveText(['2']);
    await quiz.locator('[data-testid="next-question"]').click();
    await expect(questionIds).toHaveText(['3']);
    await expect(page).toHaveURL(/\/replace-sibling\/lesson\/7\/quiz\/3(\?|$)/);

    await page.waitForTimeout(500);
    await ionPageHidden(page, 'replace-sibling-lesson-content');

    await ionBackClick(page, 'replace-sibling-lesson-quiz');
    await ionPageVisible(page, 'replace-sibling-lesson-content');
    await expect(page).toHaveURL(/\/replace-sibling\/lesson\/7\/content(\?|$)/);
    await expect(lesson.locator('[data-testid="lesson-mount"]')).toHaveText(mountBefore!);
    await expect(lesson.locator('[data-testid="lesson-count"]')).toHaveText('1');
  });

  test('should keep the page behind a redirect mounted while it is in the back history', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });
    await page.goto(withTestingMode('/replace-sibling/home'));
    await ionPageVisible(page, 'replace-sibling-home');

    const home = page.locator('[data-pageid="replace-sibling-home"]');
    await home.locator('[data-testid="increment"]').click();
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
    const mountBefore = await home.locator('[data-testid="home-mount"]').textContent();

    // The redirect route renders <Navigate replace />, so it replaces itself
    // with the list. Home is still the back target.
    await home.locator('[data-testid="open-redirect"]').click();
    await ionPageVisible(page, 'replace-sibling-list');
    await expect(page).toHaveURL(/\/replace-sibling\/list(\?|$)/);

    await page.waitForTimeout(500);
    await ionPageHidden(page, 'replace-sibling-home');

    await ionBackClick(page, 'replace-sibling-list');
    await ionPageVisible(page, 'replace-sibling-home');
    await expect(home.locator('[data-testid="home-mount"]')).toHaveText(mountBefore!);
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
  });

  test('should hide the page behind a two-hop redirect and keep it mounted', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });

    await page.goto(withTestingMode('/replace-sibling/home'));
    await ionPageVisible(page, 'replace-sibling-home');

    const home = page.locator('[data-pageid="replace-sibling-home"]');
    await home.locator('[data-testid="increment"]').click();
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
    const mountBefore = await home.locator('[data-testid="home-mount"]').textContent();

    // Two page-less routes in a row, each replacing itself on mount.
    await home.locator('[data-testid="open-two-hop"]').click();
    await ionPageVisible(page, 'replace-sibling-list');
    await expect(page).toHaveURL(/\/replace-sibling\/list(\?|$)/);

    await page.waitForTimeout(500);
    await ionPageHidden(page, 'replace-sibling-home');

    await ionBackClick(page, 'replace-sibling-list');
    await ionPageVisible(page, 'replace-sibling-home');
    await expect(home.locator('[data-testid="home-mount"]')).toHaveText(mountBefore!);
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
  });

  test('should unmount the page behind a redirect once it is out of the back history', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });

    await page.goto(withTestingMode('/replace-sibling/home'));
    await ionPageVisible(page, 'replace-sibling-home');

    // Home replaces into a page-less gate, which replaces itself with the
    // target. Neither Home nor the gate is left in history.
    await page.locator('[data-pageid="replace-sibling-home"] [data-testid="replace-through-gate"]').click();
    await ionPageVisible(page, 'replace-sibling-gate-target');
    await expect(page).toHaveURL(/\/replace-sibling-gate\/target(\?|$)/);

    await page.waitForTimeout(500);
    await ionPageDoesNotExist(page, 'replace-sibling-home');
  });

  test('should swipe back to the page behind a replaced page', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31815',
    });
    // Real animations are needed for the swipe gesture, so no testing mode.
    await page.goto('/replace-sibling/home?ionic:mode=ios');
    await ionPageVisible(page, 'replace-sibling-home');

    const home = page.locator('[data-pageid="replace-sibling-home"]');
    await home.locator('[data-testid="increment"]').click();
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
    const mountBefore = await home.locator('[data-testid="home-mount"]').textContent();

    await home.locator('[data-testid="open-new"]').click();
    await ionPageVisible(page, 'replace-sibling-new');

    await page.locator('[data-testid="save"]').click();
    await ionPageVisible(page, 'replace-sibling-list');
    await page.waitForTimeout(500);

    await ionSwipeToGoBack(page, true);
    await ionPageVisible(page, 'replace-sibling-home');
    await expect(page).toHaveURL(/\/replace-sibling\/home(\?|$)/);
    await expect(home.locator('[data-testid="home-mount"]')).toHaveText(mountBefore!);
    await expect(home.locator('[data-testid="home-count"]')).toHaveText('1');
  });
});
