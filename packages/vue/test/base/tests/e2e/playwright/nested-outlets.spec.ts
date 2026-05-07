import { test } from '@playwright/test';
import {
  ionPageVisible,
  ionPageHidden,
  ionPageDoesNotExist,
  ionBackClick,
  routerPush,
  routerReplace,
  withTestingMode,
} from './utils/test-utils';

/**
 * Nested outlets exercise viewStacks indexing by outletId across inner
 * and outer stacks. Animations are disabled via withTestingMode for
 * deterministic assertions.
 */

test.describe('Nested outlets', () => {
  test('navigates within the inner outlet without affecting the outer', async ({ page }) => {
    await page.goto(withTestingMode('/nested'));
    await ionPageVisible(page, 'nestedchild');

    await page.locator('#nested-child-two').click();
    await ionPageVisible(page, 'nestedchildtwo');
    await ionPageHidden(page, 'nestedchild');
  });

  test('back button in inner outlet returns to the previous inner page', async ({ page }) => {
    await page.goto(withTestingMode('/nested'));
    await ionPageVisible(page, 'nestedchild');

    await page.locator('#nested-child-two').click();
    await ionPageVisible(page, 'nestedchildtwo');

    await ionBackClick(page, 'nestedchildtwo');
    await ionPageVisible(page, 'nestedchild');
  });

  test('navigating across nested outlet contexts and back restores the outer', async ({ page }) => {
    await page.goto(withTestingMode('/nested'));
    await ionPageVisible(page, 'nestedchild');

    // Navigate from inner outlet into a tabs context (a different outlet).
    await page.locator('#nested-tabs').click();
    await ionPageHidden(page, 'routeroutlet');
    await ionPageVisible(page, 'tab1');

    // Going back from tab1 must leave the tabs context entirely and
    // return to the nested router-outlet host page.
    await ionBackClick(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab1');
    await ionPageVisible(page, 'routeroutlet');
  });

  test('replacing an inner-outlet route preserves the outer back path', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await routerPush(page, '/nested');
    await ionPageHidden(page, 'home');
    await ionPageVisible(page, 'nestedchild');

    await routerReplace(page, '/nested/two');
    await ionPageDoesNotExist(page, 'nestedchild');
    await ionPageVisible(page, 'nestedchildtwo');

    // The outer outlet's back-button targets the host nested page's parent
    // (home). The inner replace must not have shifted that reference.
    await page.locator('#routeroutlet-back-button').click();
    await ionPageDoesNotExist(page, 'nestedchildtwo');
    await ionPageVisible(page, 'home');
  });
});
