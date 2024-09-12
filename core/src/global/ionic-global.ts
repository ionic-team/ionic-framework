import { Build, getMode, setMode, setPlatformHelpers } from '@stencil/core';

import type { IonicConfig, Mode } from '../interface';
import { shouldUseCloseWatcher } from '../utils/hardware-back-button';
import { printIonWarning } from '../utils/logging';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { config, configFromSession, configFromURL, saveConfig } from './config';

// TODO(FW-2832): types

let defaultMode: Mode;

export const getIonMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || defaultMode;
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

  const platformHelpers: any = {};
  if (userConfig._ael) {
    platformHelpers.ael = userConfig._ael;
  }
  if (userConfig._rel) {
    platformHelpers.rel = userConfig._rel;
  }
  if (userConfig._ce) {
    platformHelpers.ce = userConfig._ce;
  }
  setPlatformHelpers(platformHelpers);

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
          console.warn('Invalid ionic mode: "' + elmMode + '", expected: "ios" or "md"');
        }
      }
      elm = elm.parentElement;
    }
    return defaultMode;
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
            'experimentalCloseWatcher was set to `true`, but hardwareBackButton was set to `false`. Both config options must be `true` for the Close Watcher API to be used.'
          );
        }

        hardwareBackButtonModule.blockHardwareBackButton();
      }
      if (typeof (window as any) !== 'undefined') {
        import('../utils/keyboard/keyboard').then((module) => module.startKeyboardAssist(window));
      }
      // TODO
      // import('../../utils/focus-visible').then((module) => (this.focusVisible = module.startFocusVisible()));
    });
  }
};

export default initialize;
