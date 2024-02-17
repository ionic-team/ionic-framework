import { getMode, setMode, setPlatformHelpers, getElement } from '@stencil/core';
import { printIonWarning } from '@utils/logging';

import type { IonicConfig, Mode, Theme } from '../interface';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { config, configFromSession, configFromURL, saveConfig } from './config';

let defaultMode: Mode;
let defaultTheme: Theme;

export const getIonMode = (ref?: any): Mode => {
  if (ref?.mode) {
    return ref.mode;
  }

  const theme = getMode(ref);

  if (theme === 'ios' || theme === 'md') {
    return theme;
  }

  const el = getElement(ref);
  return el.closest('[mode]')?.getAttribute('mode') as Mode || defaultMode;

};

export const getIonTheme = (ref?: any): Theme => {
  return (ref && getMode(ref)) || getIonMode(ref) || defaultTheme;
}

// export const getIonPlatform = (ref?: any): Platform => {
//   if (ref?.platform) {
//     return ref.platform;
//   }

//   // TODO remove mode in the future
//   if (ref?.mode) {
//     return ref.mode;
//   }

//   const el = getElement(ref);
//   return el.closest('[platform]')?.getAttribute('platform') as Platform || defaultPlatform;
// }


/**
 * @deprecated
 */
const isModeSupported = (elmMode: string) => ['ios', 'md'].includes(elmMode);

const isThemeSupported = (theme: string) => ['ios', 'md'].includes(theme);

const isIonicElement = (elm: HTMLElement) => elm.tagName?.startsWith('ION-');

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

  const theme = config.get('theme', doc.documentElement.getAttribute('theme'));

  if (theme) {
    Ionic.theme = defaultTheme = theme;
    config.set('theme', defaultTheme);
    doc.documentElement.setAttribute('theme', defaultTheme);
    doc.documentElement.classList.add(defaultTheme);
  } else {
    Ionic.mode = defaultMode = config.get(
      'mode',
      doc.documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md')
    );
    config.set('mode', defaultMode);
    doc.documentElement.setAttribute('mode', defaultMode);
    doc.documentElement.classList.add(defaultMode);
  }

  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  setMode((elm: any) => {
    while (elm) {
      const theme = (elm as any).theme || elm.getAttribute('theme');

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
      const elmMode = (elm as any).mode || elm.getAttribute('mode');

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
};

export default initialize;
