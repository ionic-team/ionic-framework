import { Page, PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions, Response, TestInfo, test as base } from '@playwright/test';
import type { HostElement } from '@stencil/core/internal';

export type E2EPage = Page & {
  /**
   * Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
   * last redirect.
   *
   * The method will throw an error if:
   * - there's an SSL error (e.g. in case of self-signed certificates).
   * - target URL is invalid.
   * - the `timeout` is exceeded during navigation.
   * - the remote server does not respond or is unreachable.
   * - the main resource failed to load.
   *
   * The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404 "Not
   * Found" and 500 "Internal Server Error".  The status code for such responses can be retrieved by calling
   * [response.status()](https://playwright.dev/docs/api/class-response#response-status).
   *
   * > NOTE: The method either throws an error or returns a main resource response. The only exceptions are navigation to
   * `about:blank` or navigation to the same URL with a different hash, which would succeed and return `null`.
   * > NOTE: Headless mode doesn't support navigation to a PDF document. See the
   * [upstream issue](https://bugs.chromium.org/p/chromium/issues/detail?id=761295).
   *
   * Shortcut for main frame's [frame.goto(url[, options])](https://playwright.dev/docs/api/class-frame#frame-goto)
   * @param url URL to navigate page to. The url should include scheme, e.g. `https://`. When a `baseURL` via the context options was provided and the passed URL is a path, it gets merged via the
   * [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
   * @param options
   */
  goto: (url: string) => Promise<null | Response>;
  /**
   * Increases the size of the page viewport to match the `ion-content` contents.
   * Use this method when taking full-screen screenshots.
   */
  setIonViewport: () => Promise<void>;
  /**
   * This provides metadata that can be used to create a unique screenshot URL.
   * For example, we need to be able to differentiate between iOS in LTR mode and iOS in RTL mode.
   */
  getSnapshotSettings: () => string;
  /**
   * After changes have been made to a component, such as a update to a property or attribute,
   * the test page does not automatically apply the changes.
   * In order to wait for, and apply the update, call await page.waitForChanges().
   */
  waitForChanges: () => Promise<void>;
  /**
   * Listens on the window for a specific event to be dispatched.
   * Will wait a maximum of 5 seconds for the event to be dispatched.
   */
  waitForCustomEvent: (eventName: string) => Promise<Page>;
}

type CustomTestArgs = PlaywrightTestArgs & PlaywrightTestOptions & PlaywrightWorkerArgs & PlaywrightWorkerOptions & {
  page: E2EPage
}

type CustomFixtures = {
  page: E2EPage
};

export const test = base.extend<CustomFixtures>({
  page: async ({ page }: CustomTestArgs, use: (r: E2EPage) => Promise<void>, testInfo: TestInfo) => {
    const oldGoTo = page.goto.bind(page);

    /**
     * This is an extended version of Playwright's
     * page.goto method. In addition to performing
     * the normal page.goto work, this code also
     * automatically waits for the Stencil components
     * to be hydrated before proceeding with the test.
     */
    page.goto = async (url: string) => {
      const { mode, rtl } = testInfo.project.metadata;

      const splitUrl = url.split('?');
      const paramsString = splitUrl[1];

      /**
       * This allows developers to force a
       * certain mode or LTR/RTL config per test.
       */
      const urlToParams = new URLSearchParams(paramsString);
      const formattedMode = urlToParams.get('ionic:mode') ?? mode;
      const formattedRtl = urlToParams.get('rtl') ?? rtl;

      const formattedUrl = `${splitUrl[0]}?ionic:_testing=true&ionic:mode=${formattedMode}&rtl=${formattedRtl}`;

      const [_, response] = await Promise.all([
        page.waitForFunction(() => (window as any).stencilAppLoaded === true, { timeout: 4750 }),
        oldGoTo(formattedUrl)
      ]);

      return response;
    }

    /**
     * This provides metadata that can be used to
     * create a unique screenshot URL.
     * For example, we need to be able to differentiate
     * between iOS in LTR mode and iOS in RTL mode.
     */
    page.getSnapshotSettings = () => {
      const url = page.url();
      const splitUrl = url.split('?');
      const paramsString = splitUrl[1];

      const { mode, rtl } = testInfo.project.metadata;

      /**
       * Account for custom settings when overriding
       * the mode/rtl setting. Fall back to the
       * project metadata if nothing was found. This
       * will happen if you call page.getSnapshotSettings
       * before page.goto.
       */
      const urlToParams = new URLSearchParams(paramsString);
      const formattedMode = urlToParams.get('ionic:mode') ?? mode;
      const formattedRtl = urlToParams.get('rtl') ?? rtl;

      /**
       * If encoded in the search params, the rtl value
       * can be `'true'` instead of `true`.
       */
      const rtlString = formattedRtl === true || formattedRtl === 'true' ? 'rtl' : 'ltr';
      return `${formattedMode}-${rtlString}`;
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

    /**
     * Implementation taken from Stencil Testing:
     * https://github.com/ionic-team/stencil/blob/main/src/testing/puppeteer/puppeteer-page.ts#L298-L363
     */
    page.waitForChanges = async () => {
      try {
        if (page.isClosed()) {
          return;
        }
        await page.evaluate(() => {
          // BROWSER CONTEXT
          return new Promise<void>((resolve) => {
            const promises: Promise<any>[] = [];

            const waitComponentOnReady = (elm: Element | ShadowRoot, promises: Promise<any>[]) => {
              if (elm != null) {
                if ('shadowRoot' in elm && elm.shadowRoot instanceof ShadowRoot) {
                  waitComponentOnReady(elm.shadowRoot, promises);
                }
                const children = elm.children;
                const len = children.length;
                for (let i = 0; i < len; i++) {
                  const childElm = children[i];
                  if (childElm != null) {
                    const childStencilElm = childElm as HostElement;
                    if (
                      childElm.tagName.includes('-') &&
                      typeof childStencilElm.componentOnReady === 'function'
                    ) {
                      promises.push(childStencilElm.componentOnReady());
                    }
                    waitComponentOnReady(childElm, promises);
                  }
                }
              }
            };

            waitComponentOnReady(document.documentElement, promises);

            Promise.all(promises)
              .then(() => resolve())
              .catch(() => resolve())
          });
        });
        if (page.isClosed()) {
          return;
        }
        await page.waitForTimeout(100);
      } catch { }
    }

    page.waitForCustomEvent = async (eventName: string) => {
      const timeoutMs = 5000;
      const ev = await page.evaluate(({ eventName, timeoutMs }) => {
        return new Promise<any>((resolve, reject) => {
          const tmr = setTimeout(() => {
            reject(new Error(`waitForCustomEvent() timeout, eventName: ${eventName}`));
          }, timeoutMs);

          window.addEventListener(
            eventName,
            (ev: any) => {
              clearTimeout(tmr);
              resolve((window as any).stencilSerializeEvent(ev))
            },
            { once: true }
          )
        });
      }, {
        eventName,
        timeoutMs
      });

      await page.waitForChanges();
      return ev;
    }

    await use(page);
  },
});
