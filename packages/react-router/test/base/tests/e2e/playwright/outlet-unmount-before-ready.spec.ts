import { test, expect } from '@playwright/test';
import { ionPageVisible, withTestingMode } from './utils/test-utils';

test.describe('Outlet Unmount Before Ready', () => {
  test('should not throw when an ionPage outlet unmounts before it is ready', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31513',
    });

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(withTestingMode('/outlet-unmount-before-ready'));
    await ionPageVisible(page, 'outlet-unmount-before-ready');

    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.locator('#mount-transient-outlet').click();
      await expect(page.locator('#attempts')).toHaveText(String(attempt));
    }

    // Give the async ready callback time to fire.
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
    await ionPageVisible(page, 'outlet-unmount-before-ready');
  });
});
