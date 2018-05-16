import 'ionicons';
import { configFromURL } from '../utils/config';
import { isIOS } from '../utils/platform';
import { Config } from './config';


const Ionic = (window as any)['Ionic'] = (window as any)['Ionic'] || {};
declare const Context: any;

// queue used to coordinate DOM reads and
// write in order to avoid layout thrashing
Object.defineProperty(Ionic, 'queue', {
  get: () => Context['queue']
});

// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
const config = Ionic['config'] = Context['config'] = new Config({
  ...Ionic['config'],
  ...configFromURL()
});

// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
const documentElement = document.documentElement;
const mode = config.get('mode', documentElement.getAttribute('mode') || (isIOS(window) ? 'ios' : 'md'));
Ionic.mode = Context.mode = mode;
config.set('mode', mode);
documentElement.setAttribute('mode', Ionic.mode);
