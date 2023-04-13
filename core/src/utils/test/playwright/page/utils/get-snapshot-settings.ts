import type { Page, TestInfo } from '@playwright/test';

/**
 * This provides metadata that can be used to
 * create a unique screenshot URL.
 * For example, we need to be able to differentiate
 * between iOS in LTR mode and iOS in RTL mode.
 */
export const getSnapshotSettings = (page: Page, testInfo: TestInfo) => {
  const url = page.url();
  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  const { mode, rtl, theme } = testInfo.project.metadata;

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
  const formattedTheme = urlToParams.get('theme') ?? theme;

  /**
   * The default theme should not append to the file name
   * to avoid renaming all of the current files, but we want
   * to append to the file name if the theme is dark
   */
  const themeString = formattedTheme === 'dark' ? '-dark' : '';

  /**
   * If encoded in the search params, the rtl value
   * can be `'true'` instead of `true`.
   */
  const rtlString = formattedRtl === true || formattedRtl === 'true' ? 'rtl' : 'ltr';
  return `${formattedMode}-${rtlString}${themeString}`;
};
