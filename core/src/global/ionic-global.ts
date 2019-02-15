import { setMode } from '@stencil/core';

import { isPlatform, setupPlatforms } from '../utils/platform';

import { Config, configFromSession, configFromURL, saveConfig } from './config';

const win = window;
const Ionic = (win as any)['Ionic'] = (win as any)['Ionic'] || {};

// Setup platforms
setupPlatforms(win);

// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
const configObj = {
  ...configFromSession(),
  persistConfig: false,
  ...Ionic['config'],
  ...configFromURL()
};
const config = Ionic['config'] = new Config(configObj);
if (config.getBoolean('persistConfig')) {
  saveConfig(configObj);
}

// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
const documentElement = document.documentElement!;
const mode = config.get('mode', documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md'));
config.set('mode', mode);
documentElement.setAttribute('mode', mode);
documentElement.classList.add(mode);
if (config.getBoolean('_testing')) {
  config.set('animated', false);
}

setMode(elm => (elm as any).mode || elm.getAttribute('mode') || mode);

export { config };
