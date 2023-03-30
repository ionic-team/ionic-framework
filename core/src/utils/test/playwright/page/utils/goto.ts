import type { Page, TestInfo } from '@playwright/test';

/**
 * This is an extended version of Playwright's
 * page.goto method. In addition to performing
 * the normal page.goto work, this code also
 * automatically waits for the Stencil components
 * to be hydrated before proceeding with the test.
 */
export const goto = async (page: Page, url: string, options: any, testInfo: TestInfo, originalFn: typeof page.goto) => {
  const { mode, rtl, _testing } = testInfo.project.metadata;

  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  /**
   * This allows developers to force a
   * certain mode or LTR/RTL config per test.
   */
  const urlToParams = new URLSearchParams(paramsString);
  const formattedMode = urlToParams.get('ionic:mode') ?? mode;
  const formattedRtl = urlToParams.get('rtl') ?? rtl;
  const ionicTesting = urlToParams.get('ionic:_testing') ?? _testing;

  /**
   * Pass through other custom query params
   */
  urlToParams.delete('ionic:mode');
  urlToParams.delete('rtl');
  urlToParams.delete('ionic:_testing');

  /**
   * Convert remaining query params to a string.
   * Be sure to call decodeURIComponent to decode
   * characters such as &.
   */
  const remainingQueryParams = decodeURIComponent(urlToParams.toString());
  const remainingQueryParamsString = remainingQueryParams == '' ? '' : `&${remainingQueryParams}`;

  const formattedUrl = `${splitUrl[0]}?ionic:_testing=${ionicTesting}&ionic:mode=${formattedMode}&rtl=${formattedRtl}${remainingQueryParamsString}`;

  testInfo.annotations.push({
    type: 'mode',
    description: formattedMode,
  });

  if (rtl) {
    testInfo.annotations.push({
      type: 'rtl',
      description: 'true',
    });
  }

  const result = await Promise.all([
    page.waitForFunction(() => (window as any).testAppLoaded === true, { timeout: 4750 }),
    originalFn(formattedUrl, options),
  ]);

  return result[1];
};
