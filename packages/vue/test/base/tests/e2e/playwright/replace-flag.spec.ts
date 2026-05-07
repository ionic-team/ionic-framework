import { test, expect, type Page } from '@playwright/test';
import {
  ionPageVisible,
  ionPageDoesNotExist,
  routerGo,
  routerPush,
  routerReplace,
  withTestingMode,
} from './utils/test-utils';

/**
 * The wrapper reads `opts.history.state.replaced` to detect that a
 * navigation arrived via router.replace, since vue-router's history.listen
 * does not surface a 'replace' event type. This spec pins that the
 * replaced flag is set/cleared exactly when expected so the wrapper's
 * routerAction classification keeps working under vue-router upgrades.
 */

async function getHistoryState(page: Page) {
  await page.waitForFunction(() => Boolean((window as any).debugRouter));
  return page.evaluate(() => {
    const router = (window as any).debugRouter;
    const state = router.options.history.state;
    return {
      position: state.position,
      replaced: state.replaced === true,
      forward: state.forward,
      back: state.back,
    };
  });
}

test.describe('history.state.replaced flag', () => {
  // The initial entry written by createWebHistory uses replaceState
  // internally, so state.replaced is true on the very first goto. The test
  // starts from a fresh push to avoid asserting on that initial-load
  // detail, which is a vue-router implementation choice the wrapper does
  // not depend on.
  test('replaced flag tracks router.replace and clears on push', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    // Push first to establish a clean baseline (replaced=false).
    await routerPush(page, '/navigation');
    await ionPageVisible(page, 'navigation');
    let state = await getHistoryState(page);
    expect(state.replaced).toBe(false);

    await routerReplace(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    state = await getHistoryState(page);
    expect(state.replaced).toBe(true);

    // A subsequent push must clear the replaced flag for the new entry.
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    state = await getHistoryState(page);
    expect(state.replaced).toBe(false);
  });

  // Sequence: /home -> push /a -> replace /b -> replace /c. Going back
  // from /c returns directly to /home, not /b.
  test('successive replaces do not accumulate history entries', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await routerPush(page, '/navigation');
    await ionPageVisible(page, 'navigation');

    const beforeReplace = await getHistoryState(page);

    await routerReplace(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageDoesNotExist(page, 'navigation');

    await routerReplace(page, '/routing');
    await ionPageVisible(page, 'routing');
    await ionPageDoesNotExist(page, 'inputs');
    await ionPageDoesNotExist(page, 'navigation');

    // Position should not have advanced beyond the initial replace target.
    const afterReplaces = await getHistoryState(page);
    expect(afterReplaces.position).toBe(beforeReplace.position);
  });

  // Push after replace must truncate future history. Sequence:
  // push A -> replace B -> push C. Going back from C lands on B, and A
  // (replaced away) is no longer reachable.
  test('push after replace truncates the location history', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await routerPush(page, '/navigation');
    await routerReplace(page, '/inputs');
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    // Going back from /routing must return to /inputs, not /navigation.
    await routerGo(page, -1);
    await ionPageVisible(page, 'inputs');

    // /navigation must not be reachable - it was discarded by the replace.
    await ionPageDoesNotExist(page, 'navigation');
  });
});
