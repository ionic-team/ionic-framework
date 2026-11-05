import { expect, test, type Page } from '@playwright/test';
import { ionSwipeToGoBack } from '../../utils/drag-utils';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist } from '../../utils/test-utils';

/**
 * Starts a swipe to go back and lets go partway across, so the user
 * should stay on the current page.
 */
const abandonSwipeBack = async (page: Page) => {
  const viewport = page.viewportSize()!;
  const y = viewport.height / 2;

  await page.mouse.move(5, y);
  await page.mouse.down();
  await page.mouse.move(35, y, { steps: 5 });
  await page.mouse.move(65, y, { steps: 5 });

  // A quick drag is released with enough velocity to complete the swipe, so slow down before letting go.
  for (let i = 1; i <= 3; i++) {
    await page.mouse.move(65 + i, y);
    await page.waitForTimeout(50);
  }

  await page.mouse.up();

  // Let a back transition started by the swipe settle before asserting.
  await page.waitForTimeout(500);
};

test.describe('Swipe Animated Disabled', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/swipe-animated-disabled?ionic:mode=ios');
  });

  test('should not fire enter lifecycle events on the previous page when an abandoned swipe starts on a non-animated outlet', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
    });

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');
    await expect(page.locator('#ionViewWillEnter')).toHaveText('1');
    await expect(page.locator('#ionViewDidEnter')).toHaveText('1');

    await page.locator('#swipe-animated-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');

    await abandonSwipeBack(page);

    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');
    await expect(page.locator('#ionViewWillEnter')).toHaveText('1');
    await expect(page.locator('#ionViewDidEnter')).toHaveText('1');
  });

  test('should go back when a swipe completes on a non-animated outlet', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
    });

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');

    await page.locator('#swipe-animated-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');
    await ionPageDoesNotExist(page, 'app-swipe-animated-disabled-details');
    await expect(page.locator('#ionViewWillEnter')).toHaveText('2');
    await expect(page.locator('#ionViewDidEnter')).toHaveText('2');
  });

  test('should swipe back once the outlet becomes animated', async ({ page }) => {
    await ionPageVisible(page, 'app-swipe-animated-disabled-main');

    await page.locator('#toggle-animated').click();
    await expect(page.locator('#animated-value')).toHaveText('true');

    await page.locator('#swipe-animated-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');
    await ionPageDoesNotExist(page, 'app-swipe-animated-disabled-details');
  });
});

test.describe('Swipe Animated Disabled: global config', () => {
  test.beforeEach(async ({ page }) => {
    // Testing mode sets the global `animated` config to false.
    await page.goto('/standalone/swipe-animated-disabled?ionic:mode=ios&ionic:_testing=true');
  });

  test('should not fire enter lifecycle events on the previous page when an abandoned swipe starts with animations disabled globally', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/29793',
    });

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');

    // Animate the outlet so the global config is the only thing disabling animations.
    await page.locator('#toggle-animated').click();
    await expect(page.locator('#animated-value')).toHaveText('true');

    await page.locator('#swipe-animated-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');

    await abandonSwipeBack(page);

    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');
    await expect(page.locator('#ionViewWillEnter')).toHaveText('1');
    await expect(page.locator('#ionViewDidEnter')).toHaveText('1');
  });
});
