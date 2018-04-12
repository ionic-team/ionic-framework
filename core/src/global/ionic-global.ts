import 'ionicons';
import { createConfigController } from './config-controller';
import { PLATFORM_CONFIGS, detectPlatforms, readQueryParam } from './platform-configs';


const Ionic = (window as any).Ionic = (window as any).Ionic || {};

declare const Context: any;

// queue used to coordinate DOM reads and
// write in order to avoid layout thrashing
Object.defineProperty(Ionic, 'queue', {
  get: () => Context.queue
});

if (!Context.platforms) {
  Context.platforms = detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core');
}

if (!Context.readQueryParam) {
  Context.readQueryParam = readQueryParam;
}

// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
Ionic.config = Context.config = createConfigController(
  Ionic.config,
  Context.platforms
);

// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
Ionic.mode = Context.mode = document.documentElement.getAttribute('mode') || Context.config.get('mode', 'md');

// ensure we've got the mode attribute set on <html>
document.documentElement.setAttribute('mode', Ionic.mode);
