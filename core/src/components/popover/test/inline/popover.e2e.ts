import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

import { closePopover, openPopover } from '../test.utils';

configs().forEach(({ title, config }) => {
  test.describe('popover: inline', async () => {
    test(title('should open using isOpen and event props'), async ({ page }) => {
      await testPopover(page, config, 'props');
    });

    test(title('should open using present method'), async ({ page }) => {
      await testPopover(page, config, 'method');
    });
  });
});

const testPopover = async (page: E2EPage, config: E2EPageOptions, buttonID: string) => {
  await page.goto('/src/components/popover/test/inline', config);
  const popover = page.locator('ion-popover');

  await openPopover(page, buttonID);
  await expect(popover).toBeVisible();

  await closePopover(page);
  await expect(popover).not.toBeVisible();

  // ensure popover can be opened multiple times
  await openPopover(page, buttonID);
  await expect(popover).toBeVisible();
};
