import type { TestConfig } from './generator';
import { test } from './playwright-page';

/**
 * Draws Safari at 1 device pixel per CSS pixel in ios theme tests, instead of
 * the iPhone 12's 3. Call it inside a `test.describe` whose screenshots show
 * ios hairlines, such as item lines.
 *
 * Screenshots save 1 pixel per CSS pixel, so at 3x Safari keeps only one of
 * every three rows of pixels. A line one device pixel thick then vanishes from
 * some screenshots depending on where it lands on the page. At 1x every row
 * is kept. md and ionic lines are a full CSS pixel thick, so they never
 * vanish, and other browsers keep their own pixel ratio.
 */
export const keepSafariHairlines = (config: TestConfig) => {
  if (config.theme !== 'ios') {
    return;
  }

  test.use({
    deviceScaleFactor: async ({ browserName }, use, testInfo) => {
      await use(browserName === 'webkit' ? 1 : testInfo.project.use.deviceScaleFactor);
    },
  });
};
