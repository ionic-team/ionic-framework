import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

import { closePopover, openPopover } from '../test.utils';

test.describe('popover: inline', async () => {
  test('should open using isOpen and event props', async ({ page }) => {
    await testPopover(page, 'props');
  });

  test('should open using present method', async ({ page }) => {
    await testPopover(page, 'method');
  });
});

const testPopover = async (page: E2EPage, buttonID: string) => {
  await page.goto('/src/components/popover/test/inline');
  const popover = page.locator('ion-popover');

  await openPopover(page, buttonID);
  await expect(popover).toBeVisible();

  await closePopover(page);
  await expect(popover).not.toBeVisible();

  // ensure popover can be opened multiple times
  await openPopover(page, buttonID);
  await expect(popover).toBeVisible();
};
