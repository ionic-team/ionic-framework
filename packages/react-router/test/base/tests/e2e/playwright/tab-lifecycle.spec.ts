import { test, expect } from '@playwright/test';
import { ionPageVisible, ionTabClick, withTestingMode } from './utils/test-utils';

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

    await page.evaluate(() => { (window as any).lifecycleEvents = []; });

    await page.locator('#go-outside').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    const events = await page.evaluate(() => (window as any).lifecycleEvents as string[]);
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

    await page.evaluate(() => { (window as any).lifecycleEvents = []; });

    await page.locator('#go-outside-settings').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    const events = await page.evaluate(() => (window as any).lifecycleEvents as string[]);
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

    await page.evaluate(() => { (window as any).lifecycleEvents = []; });

    await page.locator('#go-back-to-tabs').click();
    await ionPageVisible(page, 'tab-lifecycle-home');

    const events = await page.evaluate(() => (window as any).lifecycleEvents as string[]);
    expect(events).toContain('home:ionViewWillEnter');
    expect(events).toContain('home:ionViewDidEnter');
  });
});
