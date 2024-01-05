import { getMode, setMode, setPlatformHelpers } from '@stencil/core';

import type { IonicConfig, Mode } from '../interface';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { config, configFromSession, configFromURL, saveConfig } from './config';

// TODO(FW-2832): types

let defaultMode: Mode;

export const getIonMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || defaultMode;
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

  const isAllowedIonicModeValue = (elmMode: string) => ['ios', 'md', 'md3'].includes(elmMode);

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
};

export default initialize;
