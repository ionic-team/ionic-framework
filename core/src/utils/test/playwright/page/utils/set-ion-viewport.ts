import type { Page } from '@playwright/test';

import type { SetIonViewportOptions } from '../../playwright-declarations';

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
export const setIonViewport = async (page: Page, options?: SetIonViewportOptions) => {
  const currentViewport = page.viewportSize();
  const ionContent = await page.$('ion-content');

  if (ionContent) {
    await ionContent.waitForElementState('stable');
  }

  const [x, y] = await page.evaluate(async () => {
    const content = document.querySelector('ion-content');
    if (content) {
      const innerScroll = content.shadowRoot!.querySelector('.inner-scroll')!;
      return [innerScroll.scrollWidth - content.clientWidth, innerScroll.scrollHeight - content.clientHeight];
    }
    return [0, 0];
  });

  const width = (currentViewport?.width ?? 640) + (options?.resizeViewportWidth ? x : 0);
  const height = (currentViewport?.height ?? 480) + y;

  await page.setViewportSize({
    width,
    height,
  });
};
