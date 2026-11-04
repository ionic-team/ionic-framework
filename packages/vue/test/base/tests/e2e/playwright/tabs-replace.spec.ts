import { test, expect } from './utils/test-base';
import { ionBackClick, ionPageVisible, ionPageDoesNotExist, ionRouterNavigate, ionRouterReplace, routerPush, tabClick } from './utils/test-utils';

/**
 * Replacing a page in a tab stack should keep the pages beneath it.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/30617
 */
test.describe('Tabs: replacing a page inside a tab stack', () => {
  test('should return to the tab root on back after a tab switch and a forward replace', async ({ page }) => {
    await page.goto('/tabs/tab1');
    await ionPageVisible(page, 'tab1');

    await routerPush(page, '/tabs/tab1/view1');
    await ionPageVisible(page, 'tab1view1');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1view1');

    await ionRouterNavigate(page, '/tabs/tab1/view2', 'forward', 'replace');
    await ionPageVisible(page, 'tab1view2');

    await ionBackClick(page, 'tab1view2');

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab1');
    await ionPageVisible(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab1view2');
  });

  test('should return to the tab root on back after useIonRouter.replace', async ({ page }) => {
    await page.goto('/tabs/tab1');
    await ionPageVisible(page, 'tab1');

    await routerPush(page, '/tabs/tab1/view1');
    await ionPageVisible(page, 'tab1view1');

    await ionRouterReplace(page, '/tabs/tab1/view2');
    await ionPageVisible(page, 'tab1view2');

    await ionBackClick(page, 'tab1view2');

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab1');
    await ionPageVisible(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab1view2');
  });

  // A root replace resets the stack, so there's nothing to go back to.
  test('should not show a back button after a root replace', async ({ page }) => {
    await page.goto('/tabs/tab1');
    await ionPageVisible(page, 'tab1');

    await routerPush(page, '/tabs/tab1/view1');
    await ionPageVisible(page, 'tab1view1');

    await ionRouterNavigate(page, '/tabs/tab1/view2', 'root', 'replace');
    await ionPageVisible(page, 'tab1view2');

    await expect(page.locator('.ion-page[data-pageid="tab1view2"] ion-back-button')).toBeHidden();
  });
});
