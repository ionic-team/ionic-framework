import { Page } from '@playwright/test';

/**
 * Taking fullpage screenshots in Playwright
 * does not work with ion-content by default.
 * The reason is that full page screenshots do not
 * expand any scrollable container on the page. Instead,
 * they render the full scrollable content of the document itself.
 * To work around this, we increase the size of the document
 * so the full scrollable content inside of ion-content
 * can be captured in a screenshot.
 *
 */
export async function setIonViewport(page: Page) {
  const currentViewport = page.viewportSize();

  const pixelAmountRenderedOffscreen = await page.evaluate(() => {
    const content = document.querySelector('ion-content');
    if (content) {
      const innerScroll = content.shadowRoot!.querySelector('.inner-scroll')!;
      return innerScroll.scrollHeight - content.clientHeight;
    }
    return 0;
  });

  const width = currentViewport?.width ?? 640;
  const height = (currentViewport?.height ?? 480) + pixelAmountRenderedOffscreen;

  await page.setViewportSize({
    width,
    height
  })
}
