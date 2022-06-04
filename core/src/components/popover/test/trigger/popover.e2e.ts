import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

test.describe('popover: trigger', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/popover/test/trigger');
  });

  test('should open popover by left clicking on trigger', async ({ page }) => {
    await openPopover(page, 'left-click-trigger');
    await checkPopover(page, '.left-click-popover');
  });

  test('should open popover by right clicking on trigger', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    await page.click('#right-click-trigger', { button: 'right' });
    await ionPopoverDidPresent.next();

    await checkPopover(page, '.right-click-popover');
  });

  test('should open popover by hovering over trigger', async ({ page }) => {
    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

    const button = page.locator('#hover-trigger');
    await button.hover();
    await ionPopoverDidPresent.next();

    await checkPopover(page, '.hover-popover');
  });
});

const checkPopover = async (page: E2EPage, popoverSelector: string) => {
  const popover = page.locator(popoverSelector);
  expect(popover).toBeVisible();
};
