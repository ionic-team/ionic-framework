import { getMode, setMode } from '@stencil/core';

import type { IonicConfig, Mode } from '../interface';
import { defaultTheme as baseTheme } from '../themes/base/base.tokens';
import type { Theme as BaseTheme } from '../themes/base/base.tokens';
import { deepMerge, generateCSSVars } from '../themes/base/generate-css-vars';
import { printIonWarning } from '../utils/logging';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { config, configFromSession, configFromURL, saveConfig } from './config';

// TODO(FW-2832): types

let defaultMode: Mode;

type Theme = 'ios' | 'md' | 'ionic';

const getElement = (ref: any): HTMLElement => {
  if (ref && typeof ref === 'object' && ref.tagName) {
    return ref;
  }
  return document.documentElement;
};

/**
 * Prints a warning message to the developer to inform them of
 * an invalid configuration of mode and theme.
 * @param mode The invalid mode configuration.
 * @param theme The invalid theme configuration.
 */
const printInvalidModeWarning = (mode: Mode, theme: Theme, ref?: any) => {
  printIonWarning(
    `Invalid mode and theme combination provided: mode: ${mode}, theme: ${theme}. Fallback mode ${getDefaultModeForTheme(
      theme
    )} will be used.`,
    ref
  );
};

const applyTheme = (userTheme: BaseTheme, prefix?: string) => {
  const mergedTheme = deepMerge(baseTheme, userTheme);
  const { palette, components, ...restTokens } = mergedTheme;
  const { enabled, ...restDarkTokens } = palette.dark;

  config.set('customTheme', mergedTheme);

  const style = document.createElement('style');
  style.innerHTML = [generateCSSVars(restTokens, prefix), generateCSSVars(palette.light, prefix)].join('\n\n');

  if (enabled === 'system') {
    style.innerHTML += `@media (prefers-color-scheme: dark) {\n${generateCSSVars(restDarkTokens, prefix)}\n}`;
  }

  document.head.appendChild(style);
};

/**
 * Validates if a mode is accepted for a theme configuration.
 * @param mode The mode to validate.
 * @param theme The theme the mode is being used with.
 * @returns `true` if the mode is valid for the theme, `false` if invalid.
 */
export const isModeValidForTheme = (mode: Mode, theme: Theme) => {
  if (mode === 'md') {
    return theme === 'md' || theme === 'ionic';
  } else if (mode === 'ios') {
    return theme === 'ios' || theme === 'ionic';
  }
  return false;
};

/**
 * Returns the default mode for a specified theme.
 * @param theme The theme to return a default mode for.
 * @returns The default mode, either `ios` or `md`.
 */
const getDefaultModeForTheme = (theme: Theme): Mode => {
  if (theme === 'ios') {
    return 'ios';
  }
  return 'md';
};

/**
 * Returns the default theme for a specified mode.
 * @param mode The mode to return a default theme for.
 * @returns The default theme.
 */
const getDefaultThemeForMode = (mode: Mode): Theme => {
  if (mode === 'ios') {
    return 'ios';
  }
  return 'md';
};

// const isModeSupported = (elmMode: string) => ['ios', 'md'].includes(elmMode);

// const isThemeSupported = (theme: string) => ['ios', 'md', 'ionic'].includes(theme);

// const isIonicElement = (elm: HTMLElement) => elm.tagName?.startsWith('ION-');

/**
 * Returns the mode value of the element reference or the closest
 * parent with a valid mode.
 * @param ref The element reference to look up the mode for.
 * @param theme Optionally can provide the theme to avoid an additional look-up.
 * @returns The mode value for the element reference.
 */
export const getIonMode = (ref?: any, theme = getIonTheme(ref)): Mode => {
  if (ref?.mode && isModeValidForTheme(ref?.mode, theme)) {
    /**
     * If the reference already has a mode configuration,
     * use it instead of performing a look-up.
     */
    return ref.mode;
  } else {
    const el = getElement(ref);
    const mode = (el.closest('[mode]')?.getAttribute('mode') as Mode) || defaultMode;

    if (isModeValidForTheme(mode, theme)) {
      /**
       * The mode configuration is supported for the configured theme.
       */
      return mode;
    } else {
      printInvalidModeWarning(mode, theme, ref);
    }
  }
  return getDefaultModeForTheme(theme);
};

/**
 * Returns the theme value of the element reference or the closest
 * parent with a valid theme.
 *
 * @param ref The element reference to look up the theme for.
 * @returns The theme value for the element reference, defaults to
 * the default theme if it cannot be determined.
 */
export const getIonTheme = (ref?: any): Theme => {
  const theme: Theme = ref && getMode<Theme>(ref);
  if (theme) {
    return theme;
  }

  const el = getElement(ref);
  const mode = ref?.mode ?? (el.closest('[mode]')?.getAttribute('mode') as Mode);

  if (mode) {
    return getDefaultThemeForMode(mode);
  }

  // Return a default theme string, not the baseTheme object
  return 'md'; // or 'ionic' as your default
};

export const getIonCustomTheme = (): any => {
  const customTheme = config.get('customTheme');
  if (customTheme) {
    return customTheme;
  }
  return baseTheme;
};

export const rIC = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 32);
  }
};

export const needInputShims = () => {
  /**
   * iOS always needs input shims
   */
  const needsShimsIOS = isPlatform(window, 'ios') && isPlatform(window, 'mobile');
  if (needsShimsIOS) {
    return true;
  }

  /**
   * Android only needs input shims when running
   * in the browser and only if the browser is using the
   * new Chrome 108+ resize behavior: https://developer.chrome.com/blog/viewport-resize-behavior/
   */
  const isAndroidMobileWeb = isPlatform(window, 'android') && isPlatform(window, 'mobileweb');
  if (isAndroidMobileWeb) {
    return true;
  }

  return false;
};

export const initialize = (userConfig: IonicConfig = {}) => {
  if (typeof (window as any) === 'undefined') {
    return;
  }

  const doc = window.document;
  const win = window;
  const Ionic = ((win as any).Ionic = (win as any).Ionic || {});

  // create the Ionic.config from raw config object (if it exists)
  // and convert Ionic.config into a ConfigApi that has a get() fn
  const configObj = {
    ...configFromSession(win),
    persistConfig: false,
    ...Ionic.config,
    ...configFromURL(win),
    ...userConfig,
  };

  config.reset(configObj);
  if (config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  // Setup platforms
  setupPlatforms(win);

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by pre-rendering
  // otherwise get the mode via config settings, and fallback to md
  Ionic.config = config;
  Ionic.mode = defaultMode = config.get(
    'mode',
    doc.documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md')
  );
  config.set('mode', defaultMode);
  doc.documentElement.setAttribute('mode', defaultMode);
  doc.documentElement.classList.add(defaultMode);

  // Remove this line as 'theme' is not a valid IonicConfig key
  // config.set('theme', defaultTheme);
  // doc.documentElement.setAttribute('theme', defaultTheme);
  // doc.documentElement.classList.add(defaultTheme);

  const customTheme: BaseTheme | undefined = configObj.customTheme;

  if (customTheme) {
    applyTheme(customTheme);
  }

  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  const isIonicElement = (elm: any) => elm.tagName?.startsWith('ION-');

  const isAllowedIonicModeValue = (elmMode: string) => ['ios', 'md'].includes(elmMode);

  setMode((elm: any) => {
    while (elm) {
      const elmMode = (elm as any).mode || elm.getAttribute('mode');
      if (elmMode) {
        if (isAllowedIonicModeValue(elmMode)) {
          return elmMode;
        } else if (isIonicElement(elm)) {
          printIonWarning('Invalid ionic mode: "' + elmMode + '", expected: "ios" or "md"');
        }
      }
      elm = elm.parentElement;
    }
    return defaultMode;
  });
};

export default initialize;
