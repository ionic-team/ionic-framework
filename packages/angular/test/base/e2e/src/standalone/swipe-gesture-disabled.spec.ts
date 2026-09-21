import { test } from '@playwright/test';
import { ionSwipeToGoBack } from '../../utils/drag-utils';
import { ionPageVisible, ionPageHidden } from '../../utils/test-utils';

test.describe('Swipe Gesture Disabled', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/swipe-gesture-disabled?ionic:mode=ios');
  });

  test('should not swipe back when swipeGesture is false', async ({ page }) => {
    await ionPageVisible(page, 'app-swipe-gesture-disabled-main');

    await page.locator('#swipe-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-gesture-disabled-details');
    await ionPageHidden(page, 'app-swipe-gesture-disabled-main');

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'app-swipe-gesture-disabled-details');
    await ionPageHidden(page, 'app-swipe-gesture-disabled-main');
  });
});
