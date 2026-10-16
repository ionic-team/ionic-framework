import type { Page } from "@playwright/test";
import { test, expect } from "./utils/test-base";
import { ionPageHidden, ionPageVisible, tabClick } from "./utils/test-utils";

const enableTabTap = (page: Page) =>
  page.evaluate(() => (window as any).Ionic.config.set("tabTap", true));

const scrollContent = async (page: Page, pageId: string) => {
  const content = page.locator(
    `.ion-page[data-pageid="${pageId}"] ion-content`
  );
  await content.evaluate(async (el: HTMLIonContentElement) => {
    const scrollEl = await el.getScrollElement();
    scrollEl.scrollTop = 500;
  });
  await expect.poll(() => getScrollTop(page, pageId)).toBeGreaterThan(0);
};

const getScrollTop = (page: Page, pageId: string) =>
  page
    .locator(`.ion-page[data-pageid="${pageId}"] ion-content`)
    .evaluate(
      async (el: HTMLIonContentElement) =>
        (await el.getScrollElement()).scrollTop
    );

/**
 * Counts the calls to `ion-content`'s `scrollToTop` so that tests can verify
 * whether a scroll was requested, even if the scrolled page is removed afterwards.
 */
const trackScrollToTop = (page: Page) =>
  page.evaluate(() => {
    const win = window as any;
    const proto = customElements.get("ion-content")!.prototype;
    const scrollToTop = proto.scrollToTop;

    win.scrollToTopCalls = 0;
    proto.scrollToTop = function (...args: any[]) {
      win.scrollToTopCalls++;
      return scrollToTop.apply(this, args);
    };
  });

const getScrollToTopCalls = (page: Page) =>
  page.evaluate(() => (window as any).scrollToTopCalls);

test.describe("Tabs: tabTap", () => {
  test("should scroll to the top when pressing the active tab button at the root of the tab", async ({
    page,
  }) => {
    await page.goto("/tab-tap/home");
    await ionPageVisible(page, "tab-tap-home");
    await enableTabTap(page);

    await scrollContent(page, "tab-tap-home");
    await tabClick(page, "home");

    await expect.poll(() => getScrollTop(page, "tab-tap-home")).toBe(0);
  });

  test("should not scroll when switching to another tab", async ({ page }) => {
    await page.goto("/tab-tap/home");
    await ionPageVisible(page, "tab-tap-home");
    await enableTabTap(page);

    await scrollContent(page, "tab-tap-home");

    await tabClick(page, "other");
    await ionPageVisible(page, "tab-tap-other");
    await ionPageHidden(page, "tab-tap-home");

    await tabClick(page, "home");
    await ionPageVisible(page, "tab-tap-home");
    await ionPageHidden(page, "tab-tap-other");

    await expect
      .poll(() => getScrollTop(page, "tab-tap-home"))
      .toBeGreaterThan(0);
  });

  test("should go back to the tab root without scrolling the child page", async ({
    page,
  }) => {
    await page.goto("/tab-tap/home");
    await ionPageVisible(page, "tab-tap-home");
    await enableTabTap(page);
    await trackScrollToTop(page);

    await page
      .locator("div.ion-page[data-pageid=tab-tap-home] #go-to-child")
      .click();
    await ionPageVisible(page, "tab-tap-child");

    await tabClick(page, "home");
    await ionPageVisible(page, "tab-tap-home");

    await expect(page).toHaveURL(/\/tab-tap\/home(\?|$)/);
    expect(await getScrollToTopCalls(page)).toBe(0);
  });

  test("should not scroll when tabTap is not enabled", async ({ page }) => {
    await page.goto("/tab-tap/home");
    await ionPageVisible(page, "tab-tap-home");

    await scrollContent(page, "tab-tap-home");
    await tabClick(page, "home");
    await page.waitForTimeout(500);

    expect(await getScrollTop(page, "tab-tap-home")).toBeGreaterThan(0);
  });
});
