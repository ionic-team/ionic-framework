import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

test.describe('popover: trigger', async () => {
  test('should open popover by left clicking on trigger', async ({ page }) => {
    await screenshotPopover(page, 'left-click-trigger', 'trigger');
  });

  test('should open popover by right clicking on trigger', async ({ page }) => {
    await page.goto('/src/components/popover/test/trigger');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.click('#right-click-trigger', { button: 'right' });
    await ionPopoverDidPresent.next();

    await page.setIonViewport();
    expect(await page.screenshot()).toMatchSnapshot(`popover-trigger-right-click-trigger-${page.getSnapshotSettings()}.png`);
  });

  test('should open popover by hovering over trigger', async ({ page }) => {
    await page.goto('/src/components/popover/test/trigger');
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const button = page.locator('#hover-trigger');
    await button.hover();
    await ionPopoverDidPresent.next();

    await page.setIonViewport();
    expect(await page.screenshot()).toMatchSnapshot(`popover-trigger-hover-trigger-${page.getSnapshotSettings()}.png`);
  });

  test('should not close main popover with dismiss-on-select when clicking a trigger', async ({ page }) => {
    await page.goto('/src/components/popover/test/trigger');

    await openPopover(page, 'nested-click-trigger');
    await openPopover(page, 'nested-click-trigger-two');

    await page.setIonViewport();
    expect(await page.screenshot()).toMatchSnapshot(`popover-trigger-nested-click-trigger-${page.getSnapshotSettings()}.png`);
  });
});
