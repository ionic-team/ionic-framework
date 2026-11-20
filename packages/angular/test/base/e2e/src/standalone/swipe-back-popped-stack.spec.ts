import { expect, test } from '@playwright/test';
import { ionSwipeToGoBack } from '../../utils/drag-utils';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist } from '../../utils/test-utils';

test.describe('Swipe Back: Popped Stack', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/swipe-animated-disabled?ionic:mode=ios');
  });

  test('should ignore a swipe when a navigation pops the stack before the gesture starts', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31291',
    });

    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');

    // Only an animated outlet starts the back transition when the gesture starts.
    await page.locator('#toggle-animated').click();
    await expect(page.locator('#animated-value')).toHaveText('true');

    await page.locator('#swipe-animated-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');

    const y = page.viewportSize()!.height / 2;

    // The gesture checks that it can go back when the pointer goes down.
    await page.mouse.move(5, y);
    await page.mouse.down();

    // Leave nothing to go back to before the pointer passes the gesture threshold.
    await page.evaluate(() => window.history.back());
    await ionPageVisible(page, 'app-swipe-animated-disabled-main');
    await ionPageDoesNotExist(page, 'app-swipe-animated-disabled-details');

    await page.mouse.move(35, y, { steps: 5 });
    await page.mouse.up();

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');
    expect(pageErrors).toEqual([]);

    // The ignored swipe should not leave the gesture stuck in progress.
    await page.locator('#swipe-animated-disabled-details').click();
    await ionPageVisible(page, 'app-swipe-animated-disabled-details');
    await ionPageHidden(page, 'app-swipe-animated-disabled-main');

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'app-swipe-animated-disabled-main');
    await ionPageDoesNotExist(page, 'app-swipe-animated-disabled-details');
  });
});
