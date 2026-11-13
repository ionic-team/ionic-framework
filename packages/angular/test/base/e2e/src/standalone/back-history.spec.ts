import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { ionPageHidden, ionPageVisible } from '../../utils/test-utils';
import { ionSwipeToGoBack } from '../../utils/drag-utils';

const historyLength = (page: Page) => page.evaluate(() => window.history.length);

const annotateIssue = (testInfo: TestInfo) => {
  testInfo.annotations.push({
    type: 'issue',
    description: 'https://github.com/ionic-team/ionic-framework/issues/23448',
  });
};

const goToC = async (page: Page) => {
  await ionPageVisible(page, 'app-back-history-a');

  await page.locator('#go-to-b').click();
  await ionPageVisible(page, 'app-back-history-b');

  await page.locator('#go-to-c').click();
  await ionPageVisible(page, 'app-back-history-c');
};

test.describe('Back navigation browser history', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/back-history?ionic:_testing=true');
    await goToC(page);
  });

  test('ion-back-button should go back in history instead of adding an entry', async ({ page }, testInfo) => {
    annotateIssue(testInfo);
    const lengthOnC = await historyLength(page);

    await page.locator('app-back-history-c ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-b');
    await expect(page).toHaveURL(/\/standalone\/back-history\/b$/);
    expect(await historyLength(page)).toBe(lengthOnC);

    await page.goBack();
    await ionPageVisible(page, 'app-back-history-a');
    await expect(page).toHaveURL(/\/standalone\/back-history(\?|$)/);
  });

  test('ion-back-button should keep going back in history on a page it already went back to', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('app-back-history-c ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-b');
    await expect(page.locator('app-back-history-c')).toHaveCount(0);

    await page.locator('#go-to-c').click();
    await ionPageVisible(page, 'app-back-history-c');

    await page.locator('app-back-history-c ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-b');

    await page.locator('app-back-history-b ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-a');

    await expect(page.locator('app-back-history-b')).toHaveCount(0);

    // B is still the forward entry, so no entry was pushed.
    await page.goForward();
    await ionPageVisible(page, 'app-back-history-b');
  });

  test('should go back in history after the previous page was replaced', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.goBack();
    await ionPageVisible(page, 'app-back-history-b');
    await expect(page.locator('app-back-history-c')).toHaveCount(0);

    // B is replaced by C, so A is the entry directly behind C.
    await page.locator('#replace-with-c').click();
    await ionPageVisible(page, 'app-back-history-c');

    await page.locator('app-back-history-c ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-a');
    await expect(page).toHaveURL(/\/standalone\/back-history(\?|$)/);

    await expect(page.locator('app-back-history-c')).toHaveCount(0);

    // C is still the forward entry, so no entry was pushed.
    await page.goForward();
    await ionPageVisible(page, 'app-back-history-c');
  });

  test('should go back in history to the root set with navigateRoot', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.goBack();
    await ionPageVisible(page, 'app-back-history-b');
    await expect(page.locator('app-back-history-c')).toHaveCount(0);

    await page.locator('#root-to-c').click();
    await ionPageVisible(page, 'app-back-history-c');

    await page.locator('#go-to-d').click();
    await ionPageVisible(page, 'app-back-history-d');
    const lengthOnD = await historyLength(page);

    await page.locator('app-back-history-d ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-c');
    expect(await historyLength(page)).toBe(lengthOnD);

    // The browser still has B behind the new root.
    await page.goBack();
    await ionPageVisible(page, 'app-back-history-b');
  });

  test('should keep history intact when a guard blocks leaving the page', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('#go-to-guarded').click();
    await ionPageVisible(page, 'app-back-history-guarded');

    await page.locator('#block-leave').click();
    await page.locator('app-back-history-guarded ion-back-button').click();
    await expect(page).toHaveURL(/\/standalone\/back-history\/guarded$/);
    await ionPageVisible(page, 'app-back-history-guarded');

    // C is still the entry behind the guarded page.
    await page.locator('#block-leave').click();
    await page.goBack();
    await ionPageVisible(page, 'app-back-history-c');
    await expect(page).toHaveURL(/\/standalone\/back-history\/c$/);
  });

  test('should go back in history after a guard blocks going forward', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('#go-to-d').click();
    await ionPageVisible(page, 'app-back-history-d');

    await page.locator('#block-guards').click();
    await page.locator('#d-go-to-wrapped').click();
    await ionPageVisible(page, 'app-back-history-d');
    await expect(page.locator('app-back-history-wrapped')).toHaveCount(0);

    await page.locator('app-back-history-d ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-c');
    await expect(page.locator('app-back-history-d')).toHaveCount(0);

    // D is still the forward entry, so no entry was pushed.
    await page.goForward();
    await ionPageVisible(page, 'app-back-history-d');
  });

  test('ion-back-button should go back after a blocked navigation on a URL changed outside the router', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('#go-to-d').click();
    await ionPageVisible(page, 'app-back-history-d');

    await page.locator('#d-shallow-url-update').click();
    await expect(page).toHaveURL(/\/standalone\/back-history\/d\?shallow=1$/);

    await page.locator('#block-guards').click();
    await page.locator('#d-go-to-wrapped').click();
    await expect(page).toHaveURL(/\/standalone\/back-history\/d$/);

    await page.locator('app-back-history-d ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-c');
  });

  test('ion-back-button should go back to the page left after its URL was replaced outside the router', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('#go-to-d').click();
    await ionPageVisible(page, 'app-back-history-d');

    await page.locator('#d-replace-url-with-b').click();
    await expect(page).toHaveURL(/\/standalone\/back-history\/b$/);

    await page.locator('#d-go-to-wrapped').click();
    await ionPageVisible(page, 'app-back-history-wrapped');

    await page.locator('app-back-history-wrapped ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-d');
  });

  test('should go back in history after a guard redirects the navigation', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('#go-to-redirected').click();
    await ionPageVisible(page, 'app-back-history-d');
    await expect(page).toHaveURL(/\/standalone\/back-history\/d$/);

    await page.locator('app-back-history-d ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-c');
    await expect(page.locator('app-back-history-d')).toHaveCount(0);

    // D is still the forward entry, so no entry was pushed.
    await page.goForward();
    await ionPageVisible(page, 'app-back-history-d');
  });

  test('ion-back-button should go back when the URL was changed outside the router', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await page.locator('#shallow-url-update').click();
    await expect(page).toHaveURL(/\/standalone\/back-history\/c\?shallow=1$/);

    await page.locator('app-back-history-c ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-b');
  });

  for (const { name, link, url } of [
    { name: 'a guard on a parent route', link: '#go-to-wrapped', url: /\/wrapped$/ },
    { name: 'a resolver', link: '#go-to-resolved', url: /\/resolved$/ },
  ]) {
    test(`should keep history intact when ${name} blocks going back`, async ({ page }, testInfo) => {
      annotateIssue(testInfo);

      await page.locator(link).click();
      await ionPageVisible(page, 'app-back-history-wrapped');

      await page.locator('#wrapped-go-to-d').click();
      await ionPageVisible(page, 'app-back-history-d');

      await page.locator('#block-guards').click();
      await page.locator('app-back-history-d ion-back-button').click();
      await ionPageVisible(page, 'app-back-history-d');

      // The page is still the entry behind D.
      await page.locator('#block-guards').click();
      await page.goBack();
      await ionPageVisible(page, 'app-back-history-wrapped');
      await expect(page).toHaveURL(url);
    });
  }
});

test.describe('Back navigation browser history: skipLocationChange', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/back-history?ionic:_testing=true');
  });

  test('should go back to a page shown without changing the URL', async ({ page }, testInfo) => {
    annotateIssue(testInfo);

    await ionPageVisible(page, 'app-back-history-a');

    await page.locator('#go-to-b-skip-location').click();
    await ionPageVisible(page, 'app-back-history-b');

    await page.locator('#go-to-c').click();
    await ionPageVisible(page, 'app-back-history-c');

    await page.locator('app-back-history-c ion-back-button').click();
    await ionPageVisible(page, 'app-back-history-b');
  });
});

test.describe('Back navigation browser history: NavController.pop() and hardware back button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/back-history?ionic:_testing=true&ionic:hardwareBackButton=true');
    await goToC(page);
  });

  for (const { name, goBack } of [
    { name: 'NavController.pop()', goBack: (page: Page) => page.locator('#nav-pop').click() },
    {
      name: 'the hardware back button',
      goBack: (page: Page) => page.evaluate(() => document.dispatchEvent(new Event('backbutton'))),
    },
  ]) {
    test(`${name} should go back in history instead of adding an entry`, async ({ page }, testInfo) => {
      annotateIssue(testInfo);
      const lengthOnC = await historyLength(page);

      await goBack(page);
      await ionPageVisible(page, 'app-back-history-b');
      expect(await historyLength(page)).toBe(lengthOnC);

      await page.goBack();
      await ionPageVisible(page, 'app-back-history-a');
    });
  }
});

test.describe('Back navigation browser history: swipe to go back', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/back-history?ionic:mode=ios');
    await goToC(page);
  });

  test('should go back in history instead of adding an entry', async ({ page }, testInfo) => {
    annotateIssue(testInfo);
    // The swipe can only start once the transition to C has finished.
    await ionPageHidden(page, 'app-back-history-b');
    const lengthOnC = await historyLength(page);

    await ionSwipeToGoBack(page, true);
    await ionPageVisible(page, 'app-back-history-b');
    await expect(page.locator('app-back-history-c')).toHaveCount(0);
    expect(await historyLength(page)).toBe(lengthOnC);

    await page.goBack();
    await ionPageVisible(page, 'app-back-history-a');
  });
});
