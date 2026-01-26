import { Build, getMode, setMode, getElement } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { applyComponentsTheme, applyGlobalTheme, getCustomTheme } from '@utils/theme';

import type { IonicConfig, Mode, Theme } from '../interface';
import { defaultTheme as baseTheme } from '../themes/base/default.tokens';
import type { DefaultTheme } from '../themes/themes.interfaces';
import { shouldUseCloseWatcher } from '../utils/hardware-back-button';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { config, configFromSession, configFromURL, saveConfig } from './config';

let defaultMode: Mode;
let defaultTheme: Theme = 'md';

const isModeSupported = (elmMode: string) => ['ios', 'md'].includes(elmMode);

const isThemeSupported = (theme: string) => ['ios', 'md', 'ionic'].includes(theme);

const isIonicElement = (elm: HTMLElement) => elm.tagName?.startsWith('ION-');

/**
 * Returns the mode value of the element reference or the closest
 * parent with a valid mode. If no mode is set, then fallback
 * to the default mode.
 * @param ref The element reference to look up the mode for.
 * @returns The mode value for the element reference.
 */
export const getIonMode = (ref?: any): Mode => {
  return ref?.mode || (getElement(ref).closest('[mode]')?.getAttribute('mode') as Mode) || defaultMode;
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

  /**
   * If the theme cannot be detected, then fallback to using
   * the `mode` attribute to determine the style sheets to use.
   */
  const el = getElement(ref);
  const mode = ref?.mode ?? (el.closest('[mode]')?.getAttribute('mode') as Mode);

  if (mode) {
    return mode;
  }

  /**
   * If a mode is not detected, then fallback to using the
   * default theme.
   */
  return defaultTheme;
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

  Ionic.config = config;

  /**
   * Check if the mode was set as an attribute on <html>
   * which could have been set by the user, or by pre-rendering
   * otherwise get the mode via config settings, and fallback to md.
   */
  Ionic.mode = defaultMode = config.get(
    'mode',
    doc.documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md')
  );

  /**
   * Check if the theme was set as an attribute on <html>
   * which could have been set by the user, or by pre-rendering
   * otherwise get the theme via config settings, and fallback to md.
   */

  Ionic.theme = defaultTheme = config.get('theme', doc.documentElement.getAttribute('theme') || defaultMode);

  config.set('mode', defaultMode);
  doc.documentElement.setAttribute('mode', defaultMode);
  doc.documentElement.classList.add(defaultMode);

  config.set('theme', defaultTheme);
  doc.documentElement.setAttribute('theme', defaultTheme);
  doc.documentElement.classList.add(defaultTheme);

  const customTheme: DefaultTheme | undefined = getCustomTheme(configObj.customTheme, defaultMode);

  // Apply base theme, or combine with custom theme if provided
  if (customTheme) {
    const combinedTheme = applyGlobalTheme(baseTheme, customTheme);
    // Component styles must be applied after global styles in order
    // to ensure CSS variables are available for components
    // like the semantic colors (e.g., --ion-color-shade)
    applyComponentsTheme(combinedTheme);
    config.set('customTheme', combinedTheme);
  } else {
    applyGlobalTheme(baseTheme);
    // Component styles must be applied after global styles in order
    // to ensure CSS variables are available for components
    // like the semantic colors (e.g., --ion-color-shade)
    applyComponentsTheme(baseTheme);
    config.set('customTheme', baseTheme);
  }

  // Apply any global config values from the custom theme
  const customConfig = customTheme?.config;
  if (customConfig) {
    Object.entries(customConfig).forEach(([key, value]) => {
      // A key with 'Ion' prefix indicates it's a component-specific config,
      // which should not be merged into the global config settings.
      if (key.startsWith('Ion')) {
        return;
      }

      if (typeof value === 'object' && value !== null) {
        const existingConfig = config.get(key as keyof IonicConfig, {});
        config.set(key as keyof IonicConfig, { ...existingConfig, ...value });
        return;
      }

      config.set(key as keyof IonicConfig, value);
    });
  }

  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  setMode((elm: any) => {
    /**
     * Iterate over all the element nodes, to both validate and
     * set the "mode" that is used for determining the styles to
     * apply to the element.
     *
     * setMode refers to Stencil's internal metadata for "mode",
     * which is used to set the correct styleUrl for the component.
     *
     * If the "theme" attribute or property is set, then use it
     * to determine the style sheets to use.
     *
     * If the "mode" attribute or property is set, then use it
     * to determine the style sheets to use. This is fallback
     * behavior for applications that are not setting the "theme".
     */
    while (elm) {
      const theme = elm.getAttribute('theme');

      if (theme) {
        if (isThemeSupported(theme)) {
          return theme;
        } else if (isIonicElement(elm)) {
          printIonWarning(`Invalid theme: "${theme}". Supported themes include: "ios" or "md".`);
        }
      }

      /**
       * If a theme is not detected, then fallback to using the
       * `mode` attribute to determine the style sheets to use.
       */
      const elmMode = elm.getAttribute('mode');

      if (elmMode) {
        if (isModeSupported(elmMode)) {
          return elmMode;
        } else if (isIonicElement(elm)) {
          printIonWarning(`Invalid mode: "${elmMode}". Ionic modes can be only "ios" or "md"`);
        }
      }

      elm = elm.parentElement;
    }
    return defaultTheme;
  });

  // `IonApp` code
  // ----------------------------------------------

  if (Build.isBrowser) {
    rIC(async () => {
      const isHybrid = isPlatform(window, 'hybrid');
      if (!config.getBoolean('_testing')) {
        import('../utils/tap-click').then((module) => module.startTapClick(config));
      }
      if (config.getBoolean('statusTap', isHybrid)) {
        import('../utils/status-tap').then((module) => module.startStatusTap());
      }
      if (config.getBoolean('inputShims', needInputShims())) {
        /**
         * needInputShims() ensures that only iOS and Android
         * platforms proceed into this block.
         */
        const platform = isPlatform(window, 'ios') ? 'ios' : 'android';
        import('../utils/input-shims/input-shims').then((module) => module.startInputShims(config, platform));
      }
      const hardwareBackButtonModule = await import('../utils/hardware-back-button');
      const supportsHardwareBackButtonEvents = isHybrid || shouldUseCloseWatcher();
      if (config.getBoolean('hardwareBackButton', supportsHardwareBackButtonEvents)) {
        hardwareBackButtonModule.startHardwareBackButton();
      } else {
        /**
         * If an app sets hardwareBackButton: false and experimentalCloseWatcher: true
         * then the close watcher will not be used.
         */
        if (shouldUseCloseWatcher()) {
          printIonWarning(
            '[ion-app] - experimentalCloseWatcher was set to `true`, but hardwareBackButton was set to `false`. Both config options must be `true` for the Close Watcher API to be used.'
          );
        }

        hardwareBackButtonModule.blockHardwareBackButton();
      }
      if (typeof (window as any) !== 'undefined') {
        import('../utils/keyboard/keyboard').then((module) => module.startKeyboardAssist(window));
      }
      import('../utils/focus-visible').then((module) => module.getOrInitFocusVisibleUtility());
    });
  }
};

export default initialize;
