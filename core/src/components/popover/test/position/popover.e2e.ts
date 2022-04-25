import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

// split tests up to avoid running into 30s timeout for whole thing
test.describe('popover: position', async () => {
  test('should render side=top correctly', async ({ page }) => {
    await testPopover(page, 'top', 'start');
    await testPopover(page, 'top', 'center');
    await testPopover(page, 'top', 'end');
  });

  test('should render side=right correctly', async ({ page }) => {
    await testPopover(page, 'right', 'start');
    await testPopover(page, 'right', 'center');
    await testPopover(page, 'right', 'end');
  });

  test('should render side=bottom correctly', async ({ page }) => {
    await testPopover(page, 'bottom', 'start');
    await testPopover(page, 'bottom', 'center');
    await testPopover(page, 'bottom', 'end');
  });

  test('should render side=left correctly', async ({ page }) => {
    await testPopover(page, 'left', 'start');
    await testPopover(page, 'left', 'center');
    await testPopover(page, 'left', 'end');
  });

  test('should render side=start correctly', async ({ page }) => {
    await testPopover(page, 'start', 'start');
    await testPopover(page, 'start', 'center');
    await testPopover(page, 'start', 'end');
  });

  test('should render side=end correctly', async ({ page }) => {
    await testPopover(page, 'end', 'start');
    await testPopover(page, 'end', 'center');
    await testPopover(page, 'end', 'end');
  });
});

const testPopover = async (page: E2EPage, side: string, alignment: string) => {
  await screenshotPopover(page, `${side}-${alignment}`, 'position');
};
