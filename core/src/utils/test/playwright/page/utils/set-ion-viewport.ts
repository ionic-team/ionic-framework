import type { Page } from '@playwright/test';
import { devices } from '@playwright/test';

const getDeviceForPage = (
  page: Page
): typeof devices[0] & {
  screen: {
    width: number;
    height: number;
  };
} => {
  const { userAgent } = (page.context() as any)._options;
  const deviceName = Object.keys(devices).find((key) => devices[key].userAgent.includes(userAgent));
  if (!deviceName) {
    throw new Error(`Could not find device for user agent: ${userAgent}`);
  }
  return devices[deviceName] as any;
};

/**
 * Playwright mobile devices have a smaller viewport size than their screen size.
 * When taking screenshots, this can cause the screenshot to be cropped.
 *
 * https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json#L578-L585
 *
 * We access Playwright's internal options to offset by the difference between
 * the viewport size and the screen size.
 */
const getScreenshotDeviceOffset = (page: Page) => {
  let viewportOffset = 0;

  const pageContextOptions = (page.context() as any)._options;

  if (pageContextOptions.isMobile) {
    const device = getDeviceForPage(page);
    viewportOffset = device.screen.height - pageContextOptions.viewport.height;
  }

  return viewportOffset;
};

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
export const setIonViewport = async (page: Page) => {
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
  const height = (currentViewport?.height ?? 480) + pixelAmountRenderedOffscreen + getScreenshotDeviceOffset(page);

  await page.setViewportSize({
    width,
    height,
  });
};
