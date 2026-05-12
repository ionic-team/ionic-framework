import { test, expect } from './utils/test-base';
import { ionBackClick, ionPageVisible, ionPageHidden, ionPageDoesNotExist, tabClick } from './utils/test-utils';

/**
 * When the user has child pages open in
 * two tabs and switches between them, the back button on the active tab's
 * child must pop within that tab's stack, not jump to the other tab.
 */
test.describe('Tabs: back button after switching between tabs with child pages', () => {
  test('back button on tab2 child still returns to tab2 root after multiple tab switches', async ({ page }) => {
    await page.goto('/tabs');
    await ionPageVisible(page, 'tab1');

    await page.locator('.ion-page[data-pageid="tab1"] #child-one').click();
    await ionPageVisible(page, 'tab1childone');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');
    await ionPageHidden(page, 'tab1childone');

    await page.locator('.ion-page[data-pageid="tab2"] #child-one').click();
    await ionPageVisible(page, 'tab2childone');

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1childone');
    await ionPageHidden(page, 'tab2childone');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2childone');
    await ionPageHidden(page, 'tab1childone');

    await ionBackClick(page, 'tab2childone');

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab2');
    await ionPageVisible(page, 'tab2');
    await ionPageDoesNotExist(page, 'tab2childone');
  });

  // Go back on tab1's child first, then re-enter tab2. Back on
  // tab2's child must still land on /tabs/tab2 after that sequence.
  test('back button on tab2 child works after going back in tab1 then re-entering tab2 (FW-6472 scenario B)', async ({ page }) => {
    await page.goto('/tabs');
    await ionPageVisible(page, 'tab1');

    await page.locator('.ion-page[data-pageid="tab1"] #child-one').click();
    await ionPageVisible(page, 'tab1childone');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');

    await page.locator('.ion-page[data-pageid="tab2"] #child-one').click();
    await ionPageVisible(page, 'tab2childone');

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1childone');

    await ionBackClick(page, 'tab1childone');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab1');
    await ionPageVisible(page, 'tab1');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2childone');

    await ionBackClick(page, 'tab2childone');

    await expect.poll(() => new URL(page.url()).pathname).toBe('/tabs/tab2');
    await ionPageVisible(page, 'tab2');
    await ionPageDoesNotExist(page, 'tab2childone');
  });
});
