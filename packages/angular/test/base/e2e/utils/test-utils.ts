import { expect, type Page, type Locator } from '@playwright/test';

export async function testStack(page: Page, selector: string, expectedStack: string[]) {
  const elements = page.locator(`${selector} > *`);
  const count = await elements.count();

  // Get the actual stack (tag names of child elements), filtering out non-components
  const actualStack: string[] = [];
  for (let i = 0; i < count; i++) {
    const tagName = await elements.nth(i).evaluate(el => el.tagName.toLowerCase());
    // Filter out non-component elements like 'slot', 'div', etc.
    if (tagName.includes('-') || tagName.startsWith('app-') || tagName.startsWith('ion-')) {
      actualStack.push(tagName);
    }
  }

  // Compare the actual stack with the expected stack
  expect(actualStack).toEqual(expectedStack);
}

export async function testLifeCycle(page: Page, selector: string, expectedCounts: Record<string, number>) {
  await expect(page.locator(`${selector} #ngOnInit`)).toHaveText('1');
  await expect(page.locator(`${selector} #ionViewWillEnter`)).toHaveText(expectedCounts.ionViewWillEnter.toString());
  await expect(page.locator(`${selector} #ionViewDidEnter`)).toHaveText(expectedCounts.ionViewDidEnter.toString());
  await expect(page.locator(`${selector} #ionViewWillLeave`)).toHaveText(expectedCounts.ionViewWillLeave.toString());
  await expect(page.locator(`${selector} #ionViewDidLeave`)).toHaveText(expectedCounts.ionViewDidLeave.toString());
}

export async function ionPageVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
  await expect(page.locator(selector)).toHaveClass(/ion-page/);
  await expect(page.locator(selector)).not.toHaveClass(/ion-page-hidden/);
  await expect(page.locator(selector)).not.toHaveClass(/ion-page-invisible/);
  await expect(page.locator(selector)).not.toHaveAttribute('aria-hidden', 'true');
}

export async function ionPageHidden(page: Page, selector: string) {
  await expect(page.locator(selector)).toHaveClass(/ion-page-hidden/);
  await expect(page.locator(selector)).toHaveAttribute('aria-hidden', 'true');
}

export async function ionPageDoesNotExist(page: Page, selector: string) {
  await expect(page.locator(selector)).toHaveCount(0);
}

export async function ionTabClick(page: Page, tabName: string) {
  await page.locator(`ion-tab-button`).filter({ hasText: tabName }).click();
}

export async function testTabTitle(page: Page, title: string) {
  const tab = await getSelectedTab(page);
  await expect(tab.locator('ion-title')).toHaveText(title);
  return getSelectedTab(page);
}

export async function getSelectedTab(page: Page): Promise<Locator> {
  // Wait for tab navigation to stabilize
  await page.waitForTimeout(200);

  // Look for tabs that are visible and have content
  const tabs = page.locator('ion-tabs ion-router-outlet > *:not(.ion-page-hidden)');
  const count = await tabs.count();

  // If there's only one tab, return it
  if (count === 1) {
    return tabs.first();
  }

  // If there are multiple tabs, find the one that's actually visible and has content
  for (let i = 0; i < count; i++) {
    const tab = tabs.nth(i);
    const isVisible = await tab.isVisible();
    if (isVisible) {
      return tab;
    }
  }

  // Fallback to the first tab if none are explicitly visible
  return tabs.first();
}

export async function testState(page: Page, count: number, tab: string) {

  await expect(page.locator('#tabs-state')).toHaveText(`${count}.${tab}`);
}

export async function testUrlContains(page: Page, urlFragment: string) {
  // Escape special regex characters in the URL fragment
  const escapedFragment = urlFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(escapedFragment));
}

export async function testUrlEquals(page: Page, url: string) {
  await expect(page).toHaveURL(url);
}

export async function testForward(page: Page) {
  // Wait for navigation to complete
  await page.waitForTimeout(100);

  await testStack(page, 'ion-router-outlet', ['app-router-link', 'app-router-link-page']);
  await testLifeCycle(page, 'app-router-link-page', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
  await expect(page.locator('app-router-link-page #canGoBack')).toHaveText('true');

  await page.goBack();
  await page.waitForTimeout(100);
  await testStack(page, 'ion-router-outlet', ['app-router-link']);
  await testLifeCycle(page, 'app-router-link', {
    ionViewWillEnter: 2,
    ionViewDidEnter: 2,
    ionViewWillLeave: 1,
    ionViewDidLeave: 1,
  });
}

export async function testRoot(page: Page) {
  await testStack(page, 'ion-router-outlet', ['app-router-link-page']);
  await testLifeCycle(page, 'app-router-link-page', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
  await expect(page.locator('app-router-link-page #canGoBack')).toHaveText('false');

  await page.goBack();
  await page.waitForTimeout(100);
  await testStack(page, 'ion-router-outlet', ['app-router-link']);
  await testLifeCycle(page, 'app-router-link', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
}

export async function testBack(page: Page) {
  await testStack(page, 'ion-router-outlet', ['app-router-link-page']);
  await testLifeCycle(page, 'app-router-link-page', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
  await expect(page.locator('app-router-link-page #canGoBack')).toHaveText('false');

  await page.goBack();
  await page.waitForTimeout(100);
  await testStack(page, 'ion-router-outlet', ['app-router-link']);
  await testLifeCycle(page, 'app-router-link', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
}
