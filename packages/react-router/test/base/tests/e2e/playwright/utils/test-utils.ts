import { expect, type Page } from '@playwright/test';

/**
 * Selector for React Router test pages using data-pageid attribute.
 * React test pages use `<IonPage data-pageid="page-name">` convention.
 */
function pageSelector(pageId: string): string {
  return `div.ion-page[data-pageid="${pageId}"]`;
}

/**
 * Appends ionic:_testing=true to a URL to disable Ionic animations.
 * Use for behavioral tests that don't need to verify animations.
 */
export function withTestingMode(path: string): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}ionic:_testing=true`;
}

let peakCounterId = 0;

/**
 * Start recording the largest number of elements matching `selector` (optionally
 * narrowed to those containing `containsText`) that ever coexist. The returned
 * function stops recording and resolves with the peak.
 *
 * Narrowing by text matters because several parameterized layouts can be in the
 * DOM at once, so it's what limits the count to the page under test.
 *
 * Start tracking after the last navigation. The counter lives on `window`, so a
 * `page.goto()` in between wipes it and the returned function will throw.
 */
export async function trackPeakMatchCount(
  page: Page,
  selector: string,
  containsText?: string
): Promise<() => Promise<number>> {
  const key = `__peakMatchCount${peakCounterId++}`;

  await page.evaluate(
    ({ selector, containsText, key }) => {
      const state = window as any;
      const count = () => {
        const matches = Array.from(document.querySelectorAll(selector));
        return containsText ? matches.filter((el) => el.textContent?.includes(containsText)).length : matches.length;
      };

      state[key] = count();
      const observer = new MutationObserver(() => {
        state[key] = Math.max(state[key], count());
      });
      observer.observe(document.body, { subtree: true, childList: true, characterData: true });
      state[`${key}Stop`] = () => observer.disconnect();
    },
    { selector, containsText, key }
  );

  return () =>
    page.evaluate((k) => {
      const state = window as any;
      state[`${k}Stop`]();
      return state[k] as number;
    }, key);
}

/**
 * Assert that a page is visible and not hidden or invisible.
 * Equivalent to Cypress `cy.ionPageVisible(pageId)`.
 */
export async function ionPageVisible(page: Page, pageId: string): Promise<void> {
  const locator = page.locator(pageSelector(pageId));
  await expect(locator).toHaveCount(1);
  await expect(locator).toBeVisible();
  await expect(locator).not.toHaveClass(/ion-page-hidden/);
  await expect(locator).not.toHaveClass(/ion-page-invisible/);
  await expect(locator).not.toHaveAttribute('aria-hidden', 'true');
}

/**
 * Assert that a page is hidden with ion-page-hidden class.
 * Equivalent to Cypress `cy.ionPageHidden(pageId)`.
 */
export async function ionPageHidden(page: Page, pageId: string): Promise<void> {
  const locator = page.locator(pageSelector(pageId));
  await expect(locator).toHaveClass(/ion-page-hidden/);
  await expect(locator).toHaveAttribute('aria-hidden', 'true');
  await expect(locator).toHaveCount(1);
}

/**
 * Assert that a page does not exist in the DOM.
 * Equivalent to Cypress `cy.ionPageDoesNotExist(pageId)`.
 */
export async function ionPageDoesNotExist(page: Page, pageId: string): Promise<void> {
  await expect(page.locator(pageSelector(pageId))).toHaveCount(0);
}

/**
 * Click an element matching tag + text content, then wait for transition.
 * Equivalent to Cypress `cy.ionNav(element, contains)`.
 */
export async function ionNav(page: Page, element: string, contains: string): Promise<void> {
  await page.locator(element).filter({ hasText: contains }).first().click();
  await page.waitForTimeout(250);
}

/**
 * Click the back button inside a specific page.
 * Equivalent to Cypress `cy.ionBackClick(pageId)`.
 */
export async function ionBackClick(page: Page, pageId: string): Promise<void> {
  const pageLocator = page.locator(pageSelector(pageId));
  await expect(pageLocator).toBeVisible();
  await pageLocator.locator('ion-back-button').click();
}

/**
 * Click a tab button by text.
 * Equivalent to Cypress `cy.ionTabClick(tabText)`.
 */
export async function ionTabClick(page: Page, tabText: string): Promise<void> {
  await page.locator('ion-tab-button').filter({ hasText: tabText }).click({ force: true });
}

/**
 * Click the menu button and wait for the menu animation.
 * Equivalent to Cypress `cy.ionMenuClick()`.
 */
export async function ionMenuClick(page: Page): Promise<void> {
  await page.locator('ion-menu-button').first().click({ force: true });
  await page.waitForTimeout(500);
}

/**
 * Click a menu navigation item and wait for transition.
 * Equivalent to Cypress `cy.ionMenuNav(contains)`.
 */
export async function ionMenuNav(page: Page, contains: string): Promise<void> {
  await page.locator('ion-item').filter({ hasText: contains }).first().click({ force: true });
  await page.waitForTimeout(250);
}

/**
 * Navigate browser back and optionally assert URL contains a fragment.
 * Equivalent to Cypress `cy.ionGoBack(expectedUrlPart)`.
 */
export async function ionGoBack(page: Page, expectedUrlPart?: string): Promise<void> {
  await page.goBack();
  if (expectedUrlPart) {
    const escaped = expectedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(page).toHaveURL(new RegExp(escaped));
  }
  await page.waitForTimeout(500);
}

/**
 * Navigate browser forward and optionally assert URL contains a fragment.
 * Equivalent to Cypress `cy.ionGoForward(expectedUrlPart)`.
 */
export async function ionGoForward(page: Page, expectedUrlPart?: string): Promise<void> {
  await page.goForward();
  if (expectedUrlPart) {
    const escaped = expectedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(page).toHaveURL(new RegExp(escaped));
  }
  await page.waitForTimeout(500);
}
