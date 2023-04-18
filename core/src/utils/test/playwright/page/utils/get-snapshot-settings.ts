import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';

/**
 * This provides metadata that can be used to
 * create a unique screenshot URL.
 * For example, we need to be able to differentiate
 * between iOS in LTR mode and iOS in RTL mode.
 */
export const getSnapshotSettings = (page: E2EPage, options: E2EPageOptions) => {
  const url = page.url();
  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  const { mode, direction } = options;

  /**
   * Account for custom settings when overriding
   * the mode/rtl setting. Fall back to the
   * project metadata if nothing was found. This
   * will happen if you call page.getSnapshotSettings
   * before page.goto.
   */
  const urlToParams = new URLSearchParams(paramsString);
  const formattedMode = urlToParams.get('ionic:mode') ?? mode;

  const rtlParam = urlToParams.get('rtl');
  const formattedRtl = rtlParam === 'true' ? 'rtl' : direction;

  return `${formattedMode}-${formattedRtl}`;
};
