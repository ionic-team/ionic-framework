import { createConfigController } from './config-controller';
import { detectPlatforms, PLATFORM_CONFIGS } from './platform-configs';


const Ionic = (window as any).Ionic = (window as any).Ionic || {};


// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
Context.config = createConfigController(
  Ionic.config,
  detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core')
);


// get the mode via config settings and set it to
// both Ionic and the Core global
Context.mode = Context.config.get('mode', 'md');
