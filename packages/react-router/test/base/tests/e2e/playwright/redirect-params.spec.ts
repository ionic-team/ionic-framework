import { test, expect } from '@playwright/test';
import { ionPageVisible, withTestingMode } from './utils/test-utils';

test.describe('Redirect Params', () => {

  test.describe('Flat outlet with catch-all Navigate redirect', () => {

    test('should redirect to home when navigating to a non-existing route covered by catch-all', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30081',
      });

      // 1. Navigate to flat outlet — catch-all redirects to /flat/home
      await page.goto(withTestingMode('/redirect-params/flat'));
      await ionPageVisible(page, 'home-page');
      await expect(page).toHaveURL(/\/redirect-params\/flat\/home/);

      // 2. Click a link to a non-existing route — catch-all fires, leaving view has no ionPageElement
      await page.locator('#go-to-non-existing').click();

      // 3. Should redirect back to home without crashing
      await expect(page).toHaveURL(/\/redirect-params\/flat\/home/);
      await ionPageVisible(page, 'home-page');
    });

  });

});
