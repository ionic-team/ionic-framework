import type { TestInfo } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';

/**
 * This is an extended version of Playwright's
 * page.goto method. In addition to performing
 * the normal page.goto work, this code also
 * automatically waits for the Stencil components
 * to be hydrated before proceeding with the test.
 */
export const goto = async (
  page: E2EPage,
  url: string,
  options: any,
  testInfo: TestInfo,
  originalFn: typeof page.goto
) => {
  const { _mode, _direction, _testing } = options;

  const rtl = _direction === 'rtl';

  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  /**
   * This allows developers to force a
   * certain mode or LTR/RTL config per test.
   */
  const urlToParams = new URLSearchParams(paramsString);
  const formattedMode = urlToParams.get('ionic:mode') ?? _mode;
  const formattedRtl = urlToParams.get('rtl') ?? rtl;
  const ionicTesting = urlToParams.get('ionic:_testing') ?? _testing;

  const formattedUrl = `${splitUrl[0]}?ionic:_testing=${ionicTesting}&ionic:mode=${formattedMode}&rtl=${formattedRtl}`;

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
