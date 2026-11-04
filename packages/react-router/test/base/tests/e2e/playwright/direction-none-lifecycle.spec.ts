import { test, expect, type Page } from '@playwright/test';
import { ionPageVisible, resetLifecycleEvents, settledLifecycleEvents, withTestingMode } from './utils/test-utils';

/**
 * A navigation with routerDirection="none" is not animated, but it must still
 * fire the four view lifecycle events, in the same order an animated one does.
 */
test.describe('routerDirection="none" lifecycle events', () => {
  const expectedEvents = ['a:ionViewWillLeave', 'b:ionViewWillEnter', 'b:ionViewDidEnter', 'a:ionViewDidLeave'];

  const goToPageA = async (page: Page) => {
    await page.goto(withTestingMode('/direction-none-back/a'));
    await ionPageVisible(page, 'direction-none-page-a');
    await resetLifecycleEvents(page);
  };

  test('should fire enter and leave events on a routerDirection="none" navigation', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31479',
    });

    await goToPageA(page);

    await page.locator('#go-none').click();
    await ionPageVisible(page, 'direction-none-page-b');

    expect(await settledLifecycleEvents(page)).toEqual(expectedEvents);
  });

  /**
   * The control. A forward navigation keeps its direction, so it takes the
   * regular transition path, and its event order is the one the test above
   * has to match.
   */
  test('should fire the same events for a forward navigation', async ({ page }) => {
    await goToPageA(page);

    await page.locator('#go-forward').click();
    await ionPageVisible(page, 'direction-none-page-b');

    expect(await settledLifecycleEvents(page)).toEqual(expectedEvents);
  });
});
