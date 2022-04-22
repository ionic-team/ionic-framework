import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

test.describe('popover: dismissOnSelect', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/popover/test/dismissOnSelect');
  });

  test('should not dismiss a popover when clicking a hover trigger', async ({ page }) => {
    await openPopover(page, 'hover-trigger');
    const popover = page.locator('.hover-trigger-popover');
    const hoverTrigger = page.locator('#more-hover-trigger');

    await hoverTrigger.hover();
    await hoverTrigger.click();

    expect(popover).toBeVisible();

    await page.setIonViewport();
    expect(await page.screenshot()).toMatchSnapshot(`
      popover-hover-trigger-${page.getSnapshotSettings()}.png
    `);
  });

  test('should not dismiss a popover when clicking a click trigger', async ({ page }) => {
    await openPopover(page, 'click-trigger');
    const popover = page.locator('.click-trigger-popover');
    const clickTrigger = page.locator('#more-click-trigger');

    await clickTrigger.hover();
    await clickTrigger.click();

    expect(popover).toBeVisible();

    await page.setIonViewport();
    expect(await page.screenshot()).toMatchSnapshot(`
      popover-click-trigger-${page.getSnapshotSettings()}.png
    `);
  });
});