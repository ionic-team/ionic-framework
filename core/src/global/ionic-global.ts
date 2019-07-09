import { getMode, setMode } from '@stencil/core';

import { Mode } from '../interface';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { config, configFromSession, configFromURL, saveConfig } from './config';

declare const Context: any;

let mode: Mode;

export const getIonMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || mode;
};

export default () => {
  const doc = document;
  const win = window;
  Context.config = config;
  const Ionic = (win as any).Ionic = (win as any).Ionic || {};

  // Setup platforms
  setupPlatforms(win);

  // create the Ionic.config from raw config object (if it exists)
  // and convert Ionic.config into a ConfigApi that has a get() fn
  const configObj = {
    ...configFromSession(win),
    persistConfig: false,
    ...Ionic.config,
    ...configFromURL(win)
  };

  config.reset(configObj);
  if (config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by prerendering
  // otherwise get the mode via config settings, and fallback to md
  Ionic.config = config;
  Ionic.mode = mode = config.get('mode', (doc.documentElement.getAttribute('mode')) || (isPlatform(win, 'ios') ? 'ios' : 'md'));
  config.set('mode', mode);
  doc.documentElement.setAttribute('mode', mode);
  doc.documentElement.classList.add(mode);

  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  setMode(
    (elm: any) => (elm as any).mode = (elm as any).mode || elm.getAttribute('mode') || mode
  );
};
