import { test } from '@playwright/test';

import { ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * A page that mounts during a navigation should stay with the view that rendered
 * it, even when a sibling catch-all matched the previous pathname.
 *
 * The variant without a catch-all doesn't reproduce the bug. It's there because
 * always using the owning view broke that layout.
 */
const ISSUE = 'https://github.com/ionic-team/ionic-framework/issues/31696';

for (const { base, label } of [
  { base: '/stale-register', label: 'with a catch-all sibling' },
  { base: '/stale-register-no-catch-all', label: 'without a catch-all sibling' },
]) {
  test.describe(`page that mounts during navigation, ${label}`, () => {
    test('should show the join page after each logout', async ({ page }, testInfo) => {
      testInfo.annotations.push({ type: 'issue', description: ISSUE });

      await page.goto(withTestingMode(`${base}/join`));
      await ionPageVisible(page, 'stale-register-join');

      for (let i = 0; i < 3; i++) {
        await page.locator('[data-testid="log-in"]').click();
        await ionPageVisible(page, 'stale-register-verify');

        await page.locator('[data-testid="log-out"]').click();
        await ionPageVisible(page, 'stale-register-join');
      }

      // The page used to be hidden a render after it appeared, so check it stays visible.
      await page.waitForTimeout(500);
      await ionPageVisible(page, 'stale-register-join');
    });
  });
}
