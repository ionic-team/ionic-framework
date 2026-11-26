import { test, expect, type Page } from '@playwright/test';

import { ionPageVisible, withTestingMode } from './utils/test-utils';

/**
 * An app can mount its whole route table as one Ionic view: a single root splat route whose
 * element is a plain <Routes>. Every navigation then swaps the IonPage inside the same view
 * item, and each new IonPage mounts invisible until the outlet reveals it.
 *
 * https://github.com/ionic-team/ionic-framework/issues/31525
 */

const pageButton = (page: Page, from: string, buttonId: string) =>
  page.locator(`div.ion-page[data-pageid="root-single-view-${from}"] #${buttonId}`);

test.describe('root single view', () => {
  test('reveals the page after successive root navigations', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31525',
    });

    await page.goto(withTestingMode('/root-single-view/a'));
    await ionPageVisible(page, 'root-single-view-a');
    await expect(page.locator('div.ion-page[data-pageid="root-single-view-a"]')).toHaveAttribute('data-splat', '/*');

    // The first root navigation used to work; every one after it left the page invisible.
    await pageButton(page, 'a', 'root-to-b').click();
    await ionPageVisible(page, 'root-single-view-b');

    await pageButton(page, 'b', 'root-to-c').click();
    await ionPageVisible(page, 'root-single-view-c');

    await pageButton(page, 'c', 'root-to-a').click();
    await ionPageVisible(page, 'root-single-view-a');
  });

  // A bare "*" is neither parameterized nor a "/*" container, so even plain pushes broke.
  test('reveals the page after successive pushes with a bare "*"', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31525',
    });

    await page.goto(withTestingMode('/root-single-view/a?splat=bare'));
    await ionPageVisible(page, 'root-single-view-a');
    // The query param is the only thing selecting the bare spelling, and navigation drops it.
    await expect(page.locator('div.ion-page[data-pageid="root-single-view-a"]')).toHaveAttribute('data-splat', '*');

    await pageButton(page, 'a', 'push-to-b').click();
    await ionPageVisible(page, 'root-single-view-b');

    await pageButton(page, 'b', 'push-to-c').click();
    await ionPageVisible(page, 'root-single-view-c');

    await pageButton(page, 'c', 'push-to-a').click();
    await ionPageVisible(page, 'root-single-view-a');
  });
});
