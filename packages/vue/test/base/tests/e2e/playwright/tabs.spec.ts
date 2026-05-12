import { test, expect } from './utils/test-base';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist, tabClick } from './utils/test-utils';

test.describe('Tabs', () => {
  test('browser back from preserved child page should sync URL and display', async ({ page }) => {
    // After navigating into a tab's child, switching tabs, then switching back
    // (which re-activates the preserved child page), pressing the browser back
    // button must leave URL and displayed page in sync.
    await page.goto('/tabs/tab1');
    await ionPageVisible(page, 'tab1');

    await page.locator('div.ion-page[data-pageid=tab1] #child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1childone');

    await tabClick(page, 'tab2');
    await ionPageHidden(page, 'tab1childone');
    await ionPageVisible(page, 'tab2');

    await tabClick(page, 'tab1');
    await ionPageHidden(page, 'tab2');
    await ionPageVisible(page, 'tab1childone');

    await page.goBack();

    await ionPageDoesNotExist(page, 'tab1childone');
    await ionPageVisible(page, 'tab1');
    await expect(page).toHaveURL(/\/tabs\/tab1(\?|$)/);
    await expect(page.locator('ion-tab-button#tab-button-tab1')).toHaveClass(/tab-selected/);

    // After the URL sync, tab navigation should still work: switching to
    // tab2 and back to tab1 must restore the tab1 root cleanly.
    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1');
  });
});
