import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const oldGoTo = page.goto.bind(page);


    /**
     * This is an extended version of Playwright's
     * page.goto method. In addition to performing
     * the normal page.goto work, this code also
     * automatically waits for the Stencil components
     * to be hydrated before proceeding with the test.
     */
    page.goto = (url: string) => {
      const { mode, rtl } = testInfo.project.metadata;
      const formattedUrl = `${url}?ionic:_testing=true&ionic:mode=${mode}&rtl=${rtl}`;

      return Promise.all([
        page.waitForFunction(() => window.stencilAppLoaded === true),
        oldGoTo(formattedUrl)
      ])
    }

    /**
     * This provides metadata that can be used to
     * create a unique screenshot URL.
     * For example, we need to be able to differentiate
     * between iOS in LTR mode and iOS in RTL mode.
     */
    page.getSnapshotSettings = () => {
      const { mode, rtl } = testInfo.project.metadata;
      const rtlString = rtl ? 'rtl' : 'ltr';
      return `${mode}-${rtlString}`;
    }

    /**
     * Taking fullpage screenshots in Playwright
     * does not work with ion-content by default.
     * The reason is that full page screenshots do not
     * expand any scrollable container on the page. Instead,
     * they render the full scrollable content of the document itself.
     * To work around this, we increase the size of the document
     * so the full scrollable content inside of ion-content
     * can be captured in a screenshot.
     */
    page.setIonViewport = async () => {
      const currentViewport = await page.viewportSize();

      const pixelAmountRenderedOffscreen = await page.evaluate(() => {
        const content = document.querySelector('ion-content');
        const innerScroll = content.shadowRoot.querySelector('.inner-scroll');

        return innerScroll.scrollHeight - content.clientHeight;
      });

      await page.setViewportSize({
        width: currentViewport.width,
        height: currentViewport.height + pixelAmountRenderedOffscreen
      })
    }

    await use(page);
  },
});
