import type { Page } from "@playwright/test";
import { test, expect } from "./utils/test-base";
import { ionPageVisible, routerPush, tabClick } from "./utils/test-utils";

const contentOf = (page: Page, pageId: string) =>
  page.locator(`.ion-page[data-pageid="${pageId}"] ion-content`);

/**
 * The tab bar starts following a page once the page is visible, so wait for
 * the effect to be set up on the content before scrolling it.
 */
const scrollToBottom = async (page: Page, pageId: string) => {
  const content = contentOf(page, pageId);
  await expect(content).toHaveClass(/content-tab-bar-hide-scroll-partner/);
  await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
};

const getOpacityScale = (page: Page) =>
  page
    .locator("ion-tab-bar")
    .evaluate((el) => el.style.getPropertyValue("--opacity-scale"));

test.describe("Tab Bar: scrollEffect=hide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tab-bar-scroll-effect/home");
    await ionPageVisible(page, "tab-bar-scroll-effect-home");
  });

  test("should hide the tab bar when scrolling down the first tab", async ({
    page,
  }) => {
    await scrollToBottom(page, "tab-bar-scroll-effect-home");

    await expect(page.locator("ion-tab-bar")).toHaveClass(
      /tab-bar-scroll-hidden/
    );
  });

  test("should hide the tab bar when scrolling down after switching tabs", async ({
    page,
  }) => {
    await tabClick(page, "other");
    await ionPageVisible(page, "tab-bar-scroll-effect-other");

    await scrollToBottom(page, "tab-bar-scroll-effect-other");

    await expect(page.locator("ion-tab-bar")).toHaveClass(
      /tab-bar-scroll-hidden/
    );
  });

  test("should not hide the tab bar on a child page", async ({ page }) => {
    await page.locator("#go-child").click();
    await ionPageVisible(page, "tab-bar-scroll-effect-child");

    // The tab bar stopped following the first tab and does not follow the child page
    await expect(contentOf(page, "tab-bar-scroll-effect-home")).not.toHaveClass(
      /content-tab-bar-hide-scroll-partner/
    );
    await contentOf(page, "tab-bar-scroll-effect-child").evaluate(
      (el: HTMLIonContentElement) => el.scrollToBottom(0)
    );

    await expect(page.locator("ion-tab-bar")).not.toHaveClass(
      /tab-bar-scroll-hidden/
    );
  });

  test("should hide the tab bar on a child page when tabBarScrollEffect is true", async ({
    page,
  }) => {
    await page.locator("#go-child-effect").click();
    await ionPageVisible(page, "tab-bar-scroll-effect-child-effect");

    await scrollToBottom(page, "tab-bar-scroll-effect-child-effect");

    await expect(page.locator("ion-tab-bar")).toHaveClass(
      /tab-bar-scroll-hidden/
    );
  });

  test("should show the tab bar when navigating to a child page", async ({
    page,
  }) => {
    const tabBar = page.locator("ion-tab-bar");

    await scrollToBottom(page, "tab-bar-scroll-effect-home");
    await expect(tabBar).toHaveClass(/tab-bar-scroll-hidden/);

    await routerPush(page, "/tab-bar-scroll-effect/home/child");
    await ionPageVisible(page, "tab-bar-scroll-effect-child");

    await expect(tabBar).not.toHaveClass(/tab-bar-scroll-hidden/);
  });
});

test.describe("Tab Bar: scrollEffect=fade", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tab-bar-scroll-effect/home?effect=fade");
    await ionPageVisible(page, "tab-bar-scroll-effect-home");
  });

  test("should fade the tab bar background out at the end of the content", async ({
    page,
  }) => {
    await expect.poll(() => getOpacityScale(page)).toBe("1");

    await contentOf(page, "tab-bar-scroll-effect-home").evaluate(
      (el: HTMLIonContentElement) => el.scrollToBottom(0)
    );

    await expect.poll(() => getOpacityScale(page)).toBe("0");
  });
});
