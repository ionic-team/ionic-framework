import { setMode } from '@stencil/core';
import 'ionicons';

import { isPlatform, setupPlatforms } from '../utils/platform';

import { Config, configFromSession, configFromURL, saveConfig } from './config';

const doc = document;
const win = window;
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

const config = Ionic.config = new Config(configObj);
if (config.getBoolean('persistConfig')) {
  saveConfig(win, configObj);
}

// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
const mode = config.get('mode', (doc.documentElement.getAttribute('mode')) || (isPlatform(win, 'ios') ? 'ios' : 'md'));
Ionic.mode = mode;
config.set('mode', mode);
doc.documentElement.setAttribute('mode', mode);
doc.documentElement.classList.add(mode);

if (config.getBoolean('_testing')) {
  config.set('animated', false);
}

setMode((elm: any) => (elm as any).mode || elm.getAttribute('mode') || mode);

export { config };
