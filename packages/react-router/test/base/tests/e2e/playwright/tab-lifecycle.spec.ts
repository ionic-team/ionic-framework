import { test, expect } from '@playwright/test';
import {
  ionPageVisible,
  ionTabClick,
  resetLifecycleEvents,
  settledLifecycleEvents,
  trackPeakMatchCount,
  withTestingMode,
} from './utils/test-utils';

test.describe('Tab Lifecycle Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).lifecycleEvents = [];
    });
  });

  test('ionViewDidLeave should fire on active tab child page when navigating away from tabs', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'FW-6788',
    });

    await page.goto(withTestingMode('/tab-lifecycle/home'));
    await ionPageVisible(page, 'tab-lifecycle-home');

    await resetLifecycleEvents(page);

    await page.locator('#go-outside').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    const events = await settledLifecycleEvents(page);
    expect(events).toContain('home:ionViewWillLeave');
    expect(events).toContain('home:ionViewDidLeave');
  });

  test('ionViewDidLeave should fire on active tab child page when navigating from non-default tab', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'FW-6788',
    });

    await page.goto(withTestingMode('/tab-lifecycle/home'));
    await ionPageVisible(page, 'tab-lifecycle-home');

    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'tab-lifecycle-settings');

    await resetLifecycleEvents(page);

    await page.locator('#go-outside-settings').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    const events = await settledLifecycleEvents(page);
    expect(events).toContain('settings:ionViewWillLeave');
    expect(events).toContain('settings:ionViewDidLeave');
  });

  test('ionViewDidEnter should fire on tab child page when navigating back to tabs', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'FW-6788',
    });

    await page.goto(withTestingMode('/tab-lifecycle/home'));
    await ionPageVisible(page, 'tab-lifecycle-home');

    await page.locator('#go-outside').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    await resetLifecycleEvents(page);

    await page.locator('#go-back-to-tabs').click();
    await ionPageVisible(page, 'tab-lifecycle-home');

    const events = await settledLifecycleEvents(page);
    expect(events).toContain('home:ionViewWillEnter');
    expect(events).toContain('home:ionViewDidEnter');
  });

  test('should fire enter and leave events when switching tabs', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31479',
    });

    await page.goto(withTestingMode('/tab-lifecycle/home'));
    await ionPageVisible(page, 'tab-lifecycle-home');

    await resetLifecycleEvents(page);

    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'tab-lifecycle-settings');

    expect(await settledLifecycleEvents(page)).toEqual([
      'home:ionViewWillLeave',
      'settings:ionViewWillEnter',
      'settings:ionViewDidEnter',
      'home:ionViewDidLeave',
    ]);
  });

  test('should fire enter and leave events when switching back to a visited tab', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31479',
    });

    await page.goto(withTestingMode('/tab-lifecycle/home'));
    await ionPageVisible(page, 'tab-lifecycle-home');

    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'tab-lifecycle-settings');

    await resetLifecycleEvents(page);

    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'tab-lifecycle-home');

    expect(await settledLifecycleEvents(page)).toEqual([
      'settings:ionViewWillLeave',
      'home:ionViewWillEnter',
      'home:ionViewDidEnter',
      'settings:ionViewDidLeave',
    ]);
  });

  // A duplicate tab page, even briefly, fails this spec's page assertions on a
  // strict mode violation.
  test('should not duplicate the tab page in the DOM while returning to the tabs', async ({ page }) => {
    await page.goto(withTestingMode('/tab-lifecycle/home'));
    await ionPageVisible(page, 'tab-lifecycle-home');

    await page.locator('#go-outside').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    const peakHomePages = await trackPeakMatchCount(page, 'div.ion-page[data-pageid="tab-lifecycle-home"]');

    await page.locator('#go-back-to-tabs').click();
    await ionPageVisible(page, 'tab-lifecycle-home');

    expect(await peakHomePages()).toBe(1);
  });
});
