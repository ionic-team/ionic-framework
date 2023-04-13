import type { Page, TestInfo } from '@playwright/test';

/**
 * Overwrites the default Playwright page.setContent method.
 *
 * Navigates to a blank page, sets the content, and waits for the
 * Stencil components to be hydrated before proceeding with the test.
 *
 * @param page The Playwright page object.
 * @param html The HTML content to set on the page.
 * @param testInfo The TestInfo associated with the current test run.
 */
export const setContent = async (page: Page, html: string, testInfo: TestInfo) => {
  if (page.isClosed()) {
    throw new Error('setContent unavailable: page is already closed');
  }

  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;

  const output = `
    <!DOCTYPE html>
    <html dir="${testInfo.project.metadata.rtl ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
        <link href="${baseUrl}/css/ionic.bundle.css" rel="stylesheet" />
        <link href="${baseUrl}/scripts/testing/styles.css" rel="stylesheet" />
        ${testInfo.project.metadata.theme == 'dark' && '<link href="' + baseUrl + '/scripts/testing/dark.css" rel="stylesheet" />'}
        <script src="${baseUrl}/scripts/testing/scripts.js"></script>
        <script type="module" src="${baseUrl}/dist/ionic/ionic.esm.js"></script>
        <script>
          window.Ionic = {
            config: {
              mode: '${testInfo.project.metadata.mode}'
            }
          }
        </script>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

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

    await page.goto(`${baseUrl}#`);
  }
};
