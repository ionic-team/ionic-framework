import type { Page, TestInfo } from '@playwright/test';

export const setContent = async (originalFn: typeof page.setContent, page: Page, testInfo: TestInfo, html: string, options?: any) => {
  if (page.isClosed()) {
    throw new Error('setContent unavailable: page is already closed');
  }

  if (typeof html !== 'string') {
    throw new Error('invalid html: must be a string');
  }

  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;
  const { mode, rtl, _testing } = testInfo.project.metadata;

  testInfo.annotations.push({
    type: 'mode',
    description: mode ?? 'md'
  });

  if (rtl) {
    testInfo.annotations.push({
      type: 'rtl',
      description: 'true'
    });
  }

  const output = `
    <!DOCTYPE html dir="${rtl ? 'rtl' : 'ltr'}">
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
        <link href="${baseUrl}/css/ionic.bundle.css" rel="stylesheet" />
        <link href="${baseUrl}/scripts/testing/styles.css" rel="stylesheet" />
        <script src="${baseUrl}/scripts/testing/scripts.js"></script>
        <script type="module" src="${baseUrl}/dist/ionic/ionic.esm.js"></script>
        <script>
          window.Ionic = {
            config: {
              mode: '${mode ?? 'md'}',
              _testing: ${_testing ?? false},
            }
          };
        </script>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  const result = await Promise.all([
    page.waitForFunction(() => (window as any).testAppLoaded === true, { timeout: 4750 }),
    originalFn(output, options),
  ]);

  return result[1];
}
