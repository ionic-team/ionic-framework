import { test } from '@playwright/test';
import { ionPageVisible, ionPageDoesNotExist, withTestingMode } from './utils/test-utils';

/**
 * Tests for issue #26394:
 * routerLink on IonItem (and other routing components) should allow modifier key
 * clicks (ctrl/cmd/shift+click) to open in a new tab without triggering SPA
 * navigation on the current page.
 */
test.describe('Router Link Modifier Click', () => {
  test('normal click should trigger SPA navigation', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26394',
    });

    await page.goto(withTestingMode('/router-link-modifier-click'));
    await ionPageVisible(page, 'router-link-modifier-click');

    await page.locator('#nav-to-target').click();

    await ionPageVisible(page, 'router-link-modifier-click-target');
  });

  test('meta+click should not trigger SPA navigation on the current page', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26394',
    });

    await page.goto(withTestingMode('/router-link-modifier-click'));
    await ionPageVisible(page, 'router-link-modifier-click');

    // ControlOrMeta uses Meta (Cmd) on macOS and Control on Linux/Windows,
    // both of which open the link in a new tab in Chromium rather than navigating
    // the current page. This ensures the test passes cross-platform.
    await page.locator('#nav-to-target').click({ modifiers: ['ControlOrMeta'] });
    await page.waitForTimeout(500);

    // The current page should NOT have navigated to the target via SPA
    await ionPageVisible(page, 'router-link-modifier-click');
    await ionPageDoesNotExist(page, 'router-link-modifier-click-target');
  });

  test('ctrl+click should not trigger SPA navigation on the current page', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26394',
    });

    await page.goto(withTestingMode('/router-link-modifier-click'));
    await ionPageVisible(page, 'router-link-modifier-click');

    await page.locator('#nav-to-target').click({ modifiers: ['Control'] });
    await page.waitForTimeout(500);

    // The current page should NOT have navigated to the target via SPA
    await ionPageVisible(page, 'router-link-modifier-click');
    await ionPageDoesNotExist(page, 'router-link-modifier-click-target');
  });

  test('shift+click should not trigger SPA navigation on the current page', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26394',
    });

    await page.goto(withTestingMode('/router-link-modifier-click'));
    await ionPageVisible(page, 'router-link-modifier-click');

    await page.locator('#nav-to-target').click({ modifiers: ['Shift'] });
    await page.waitForTimeout(500);

    // The current page should NOT have navigated to the target via SPA
    await ionPageVisible(page, 'router-link-modifier-click');
    await ionPageDoesNotExist(page, 'router-link-modifier-click-target');
  });
});
