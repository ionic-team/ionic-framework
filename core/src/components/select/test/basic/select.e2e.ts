import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: basic', () => {
  test('should not open multiple alert windows when clicked multiple times', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25126',
    });

    await page.goto('/src/components/select/test/basic');

    const select = page.locator('#gender');

    await select.evaluate((el: HTMLSelectElement) => {
      /*
       * Playwright's click() method attempts to scroll to the handle
       * to perform the action. That is problematic when the overlay
       * is already visible. We manually click() the element instead
       * to avoid flaky tests.
       */
      el.click();
      el.click();
      el.click();
    });

    const alerts = await page.$$('ion-alert');

    expect(alerts.length).toBe(1);
  });
});
