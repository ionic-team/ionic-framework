import { createConfigController } from './config-controller';
import { detectPlatforms, PLATFORM_CONFIGS } from './platform-configs';


const Ionic = (window as any).Ionic = (window as any).Ionic || {};


// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
Context.config = createConfigController(
  Ionic.config,
  detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core')
);


// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
Context.mode = document.documentElement.getAttribute('mode') || Context.config.get('mode', 'md');

// ensure we've got the mode attribute set on <html>
document.documentElement.setAttribute('mode', Context.mode);
