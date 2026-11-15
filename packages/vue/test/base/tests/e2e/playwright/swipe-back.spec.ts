import { test, expect } from './utils/test-base';
import { ionPageVisible, ionPageHidden, ionSwipeToGoBack } from './utils/test-utils';

/**
 * The test fixture disables animations, so these cover swipe to go back without them.
 */
test.describe('Swipe to go back without animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?ionic:mode=ios');
    await ionPageVisible(page, 'home');

    await page.locator('ion-item#routing').click({ force: true });
    await ionPageVisible(page, 'routing');
    await ionPageHidden(page, 'home');
  });

  test('should go back when the swipe completes', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
    });

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'home');
    await expect(page).toHaveURL(/\/\?/);
  });

  test('should stay on the current page when the swipe is abandoned', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
    });

    await ionSwipeToGoBack(page, false);

    await ionPageVisible(page, 'routing');
    await ionPageHidden(page, 'home');
    await expect(page).toHaveURL(/\/routing/);
  });
});
