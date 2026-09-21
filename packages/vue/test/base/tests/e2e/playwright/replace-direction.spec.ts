import type { Page } from '@playwright/test';
import { test, expect } from './utils/test-base';
import { ionPageVisible, ionBackClick, ionRouterNavigate, routerPush } from './utils/test-utils';

/**
 * useIonRouter.navigate(url, routerDirection, routerAction) must honor the
 * caller's explicit routerDirection even when routerAction is "replace",
 * regardless of the direction stored on the leaving route.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/24995
 */
test.describe('useIonRouter.navigate with routerAction="replace"', () => {
  async function readCurrentDirection(page: Page): Promise<string | undefined> {
    await page.waitForFunction(() => Boolean((window as any).debugIonNavManager));
    return page.evaluate(
      () => (window as any).debugIonNavManager.getCurrentRouteInfo()?.routerDirection
    );
  }

  // Leaving route's recorded direction is "none" on initial load.
  test('forward+replace from initial route preserves forward direction', async ({ page }) => {
    await page.goto('/');
    await ionPageVisible(page, 'home');

    await ionRouterNavigate(page, '/routing', 'forward', 'replace');
    await ionPageVisible(page, 'routing');

    expect(await readCurrentDirection(page)).toBe('forward');
  });

  // Leaving route's recorded direction is "back" after a back nav.
  test('forward+replace after a back nav preserves forward direction', async ({ page }) => {
    await page.goto('/');
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await ionBackClick(page, 'routing');
    await ionPageVisible(page, 'home');
    expect(await readCurrentDirection(page)).toBe('back');

    await ionRouterNavigate(page, '/inputs', 'forward', 'replace');
    await ionPageVisible(page, 'inputs');

    expect(await readCurrentDirection(page)).toBe('forward');
  });

  test('default useIonRouter.replace() keeps direction "root"', async ({ page }) => {
    await page.goto('/');
    await ionPageVisible(page, 'home');

    await page.waitForFunction(() => Boolean((window as any).debugIonRouter));
    await page.evaluate(() => (window as any).debugIonRouter.replace('/routing'));
    await ionPageVisible(page, 'routing');

    expect(await readCurrentDirection(page)).toBe('root');
  });
});
