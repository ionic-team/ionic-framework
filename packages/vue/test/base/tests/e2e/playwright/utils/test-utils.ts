import { expect, type Page } from '@playwright/test';

function pageSelector(pageId: string): string {
  return `.ion-page[data-pageid="${pageId}"]`;
}

/**
 * Appends ionic:_testing=true to a URL to disable Ionic animations.
 * Animation-specific tests should NOT use this; they need real animations.
 */
export function withTestingMode(path: string): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}ionic:_testing=true`;
}

export async function ionPageVisible(page: Page, pageId: string): Promise<void> {
  const locator = page.locator(pageSelector(pageId));
  await expect(locator).toHaveCount(1);
  await expect(locator).not.toHaveClass(/ion-page-hidden/);
  await expect(locator).not.toHaveClass(/ion-page-invisible/);
}

export async function ionPageHidden(page: Page, pageId: string): Promise<void> {
  const locator = page.locator(`div${pageSelector(pageId)}`);
  await expect(locator).toHaveClass(/ion-page-hidden/);
}

export async function ionPageDoesNotExist(page: Page, pageId: string): Promise<void> {
  await expect(page.locator(`div${pageSelector(pageId)}`)).toHaveCount(0);
}

export async function ionBackClick(page: Page, pageId: string): Promise<void> {
  await page.locator(`div${pageSelector(pageId)} ion-back-button`).click();
}

// window.debugRouter / debugIonRouter are wired up in test/base/src/router/index.ts
// and App.vue. Vue hydration is asynchronous, so wait for the handle before use
// or callers may hit "Cannot read properties of undefined" if they call these
// helpers immediately after page.goto().
async function waitForDebugRouter(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean((window as any).debugRouter));
}

async function waitForDebugIonRouter(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean((window as any).debugIonRouter));
}

export async function routerPush(page: Page, path: string): Promise<void> {
  await waitForDebugRouter(page);
  await page.evaluate((p: string) => (window as any).debugRouter.push(p), path);
}

export async function routerReplace(page: Page, path: string): Promise<void> {
  await waitForDebugRouter(page);
  await page.evaluate((p: string) => (window as any).debugRouter.replace(p), path);
}

export async function routerGo(page: Page, n: number): Promise<void> {
  await waitForDebugRouter(page);
  await page.evaluate((delta: number) => (window as any).debugRouter.go(delta), n);
}

/**
 * Calls IonRouter.navigate (set in App.vue via useIonRouter), which is the
 * higher-level Ionic abstraction over vue-router. Used for testing
 * routerDirection: 'root' / 'forward' / 'back' semantics.
 */
export async function ionRouterNavigate(
  page: Page,
  path: string,
  direction: 'root' | 'forward' | 'back' | 'none' = 'forward'
): Promise<void> {
  await waitForDebugIonRouter(page);
  await page.evaluate(
    ({ p, d }: { p: string; d: string }) => (window as any).debugIonRouter.navigate(p, d),
    { p: path, d: direction }
  );
}

export async function ionRouterBack(page: Page): Promise<void> {
  await waitForDebugIonRouter(page);
  await page.evaluate(() => (window as any).debugIonRouter.back());
}

export async function ionRouterReplace(page: Page, path: string): Promise<void> {
  await waitForDebugIonRouter(page);
  await page.evaluate((p: string) => (window as any).debugIonRouter.replace(p), path);
}

export async function tabClick(page: Page, tabId: string): Promise<void> {
  await page.locator(`ion-tab-button#tab-button-${tabId}`).click();
}

/**
 * Performs the iOS edge swipe-to-go-back gesture.
 * `complete=true` swipes far enough to commit the gesture; false aborts.
 *
 * Mirrors the Cypress ionSwipeToGoBack command. Uses mouse events because
 * Playwright's touch APIs don't reliably trigger Ionic's gesture detection.
 */
export async function ionSwipeToGoBack(
  page: Page,
  complete = false,
  selector = 'ion-router-outlet'
): Promise<void> {
  const outlet = page.locator(selector).first();
  const box = await outlet.boundingBox();
  if (!box) throw new Error(`outlet ${selector} not visible`);

  const y = box.y + box.height / 2;
  const increment = complete ? 60 : 5;
  const finalX = complete ? increment * 4 : 0;

  await page.mouse.move(box.x, y);
  await page.mouse.down();
  await page.mouse.move(box.x + increment * 1, y);
  await page.waitForTimeout(25);
  await page.mouse.move(box.x + increment * 2, y);
  await page.waitForTimeout(25);
  await page.mouse.move(box.x + increment * 3, y);
  await page.waitForTimeout(25);
  await page.mouse.move(box.x + finalX, y);
  await page.mouse.up();
  await page.waitForTimeout(150);
}
