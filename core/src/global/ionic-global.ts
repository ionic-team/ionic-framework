import 'ionicons';

import { isPlatform, setupPlatforms } from '../utils/platform';

import { Config, configFromSession, configFromURL, saveConfig } from './config';

const win = window;
const Ionic = (win as any)['Ionic'] = (win as any)['Ionic'] || {};
declare const Context: any;

// queue used to coordinate DOM reads and
// write in order to avoid layout thrashing
Object.defineProperty(Ionic, 'queue', {
  get: () => Context['queue']
});

// Setup platforms
setupPlatforms(win);
Context.isPlatform = isPlatform;

// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
const configObj = {
  ...configFromSession(),
  persistConfig: false,
  ...Ionic['config'],
  ...configFromURL()
};
const config = Ionic['config'] = Context['config'] = new Config(configObj);
if (config.getBoolean('persistConfig')) {
  saveConfig(configObj);
}

// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
const documentElement = document.documentElement!;
const mode = config.get('mode', documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md'));
Ionic.mode = Context.mode = mode;
config.set('mode', mode);
documentElement.setAttribute('mode', mode);
documentElement.classList.add(mode);
if (config.getBoolean('_testing')) {
  config.set('animated', false);
}
