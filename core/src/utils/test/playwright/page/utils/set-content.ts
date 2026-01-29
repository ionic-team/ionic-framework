import type { Page, TestInfo } from '@playwright/test';
import type { Direction, E2EPageOptions, Mode, Palette, Theme } from '@utils/test/playwright';

/**
 * Overwrites the default Playwright page.setContent method.
 *
 * Navigates to a blank page, sets the content, and waits for the
 * Stencil components to be hydrated before proceeding with the test.
 *
 * @param page The Playwright page object.
 * @param html The HTML content to set on the page.
 * @param testInfo The TestInfo associated with the current test run. (DEPRECATED)
 * @param options The test config associated with the current test run.
 */
export const setContent = async (page: Page, html: string, testInfo: TestInfo, options?: E2EPageOptions) => {
  if (page.isClosed()) {
    throw new Error('setContent unavailable: page is already closed');
  }

  let mode: Mode;
  let direction: Direction;
  let theme: Theme;
  let palette: Palette;

  if (options == undefined) {
    mode = testInfo.project.metadata.mode;
    direction = testInfo.project.metadata.rtl ? 'rtl' : 'ltr';
    theme = testInfo.project.metadata.theme;
    palette = testInfo.project.metadata.palette;
  } else {
    mode = options.mode;
    direction = options.direction;
    theme = options.theme;
    palette = options.palette;
  }

  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;

  // The Ionic bundle is included locally by default unless the test
  // config passes in the importIonicFromCDN option. This is useful
  // when testing with the CDN version of Ionic.
  let ionicCSSImports =
    theme === 'ionic'
      ? `
    <link href="${baseUrl}/css/ionic/bundle.ionic.css" rel="stylesheet" />
    <link href="${baseUrl}/css/utils.bundle.css" rel="stylesheet" />
  `
      : `
    <link href="${baseUrl}/css/ionic.bundle.css" rel="stylesheet" />
  `;
  let ionicJSImports = `
    <script type="module" src="${baseUrl}/dist/ionic/ionic.esm.js"></script>
  `;

  if (options?.importIonicFromCDN) {
    ionicCSSImports =
      theme === 'ionic'
        ? `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic/bundle.ionic.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core/css/utils.bundle.css" />
    `
        : `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css" />
    `;
    ionicJSImports = `
      <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js"></script>
      <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js"></script>
    `;
  }

  /**
   * This object is CRITICAL for Playwright stability.
   *
   * WHY IT'S NEEDED:
   * 1. Bypasses Dynamic Loading: It avoids the consistent import
   * failure 'await import(...)' when the global theme needed to be
   * re-applied after the initial Ionic framework load.
   * 2. Prevents Incorrect Palettes: It directly initializes with the
   * required 'enabled: "always"' palette before any scripts run. This guarantees that correct CSS variables are loaded from the start.
   * Otherwise, it would load the default light palette.
   *
   * These issues were only happening in Playwright Firefox tests
   * that use `setContent`.
   */
  const customTheme = {
    palette: {
      dark: {
        enabled: palette === 'dark' ? 'always' : 'never',
      },
      highContrast: {
        enabled: palette === 'high-contrast' ? 'always' : 'never',
      },
      highContrastDark: {
        enabled: palette === 'high-contrast-dark' ? 'always' : 'never',
      },
    },
  };

  const output = `
    <!DOCTYPE html>
    <html dir="${direction}" lang="en">
      <head>
        <title>Ionic Playwright Test</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
        ${ionicCSSImports}
        <link href="${baseUrl}/scripts/testing/styles.css" rel="stylesheet" />
        <script src="${baseUrl}/scripts/testing/scripts.js"></script>
        ${ionicJSImports}
        <script>
          window.Ionic = {
            config: {
              mode: '${mode}',
              theme: '${theme}',
              customTheme: ${JSON.stringify(customTheme)}
            }
          }
        </script>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  testInfo.annotations.push({
    type: 'mode',
    description: mode,
  });

  testInfo.annotations.push({
    type: 'palette',
    description: palette,
  });

  testInfo.annotations.push({
    type: 'theme',
    description: theme,
  });

  if (baseUrl) {
    await page.route(baseUrl, (route) => {
      if (route.request().url() === `${baseUrl}/`) {
        /**
         * Intercepts the empty page request and returns the
         * HTML content that was passed in.
         */
        route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: output,
        });
      } else {
        // Allow all other requests to pass through
        route.continue();
      }
    });

    /**
     * URL query parameters cause the custom Playwright `page.route`
     * interceptor to fail, which is necessary to inject the test HTML.
     *
     * To avoid this, the final navigation URL is kept simple by using
     * hash params to ensure the route interceptor always works.
     */
    await page.goto(`${baseUrl}#`, options);

    //   await page.waitForFunction(() => {
    //   const win = window as any;

    //   // Ensure both the global flag and component shadowRoots are ready
    //   return win.testAppLoaded === true &&
    //           win.Ionic?.config?.get?.('customTheme') !== undefined;
    // }, { timeout: 4750 });
  }
};
