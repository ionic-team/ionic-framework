import { getMode, setMode, setPlatformHelpers } from '@stencil/core';

import type { IonicConfig, Mode } from '../interface';
import { isPlatform, setupPlatforms } from '../utils/platform';

import { isBaseComponent, isIonicElement, resetBaseComponentsCache } from './base-components';
import { config, configFromSession, configFromURL, saveConfig, validateConfig } from './config';

declare const Context: any;

let defaultMode: Mode;

type Platform = 'ios' | 'md';

/**
 * Given a Stencil component class, return the visual
 * styles associated with this instance. By default, the visual
 * styles are inherited from the platform. This can be further
 * customized using the "baseComponents" global config or the
 * "useBase" property on the component.
 */
export const getIonMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || defaultMode;
};

/**
 * Given a Stencil component class, return the
 * platform associated with this instance. The platform
 * is used to determine a component's capabilities
 * and does not impact the visual styles associated with
 * this instance. The capabilities can be set using the "mode"
 * global config or property on the component.
 *
 * If no platform is specified then we fallback to
 * using getIonMode. This can happen when a component
 * has no per-mode stylesheets (such as ion-spinner).
 */
export const getIonPlatform = (ref?: any): Platform => {
  return ref?.el?.platform ?? getIonMode(ref);
};

export const initialize = (userConfig: IonicConfig = {}) => {
  if (typeof (window as any) === 'undefined') {
    return;
  }

  const doc = window.document;
  const win = window;
  Context.config = config;
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
  const configObj: IonicConfig = {
    ...configFromSession(win),
    persistConfig: false,
    ...Ionic.config,
    ...configFromURL(win),
    ...userConfig,
  };

  validateConfig(configObj);

  /**
   * Reset the base component look up table.
   * This will be re-created when needed in setMode.
   */
  resetBaseComponentsCache();

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

  const isAllowedIonicModeValue = (elmMode: string) => ['ios', 'md'].includes(elmMode);

  setMode((elm: any) => {
    const baseEl = elm;

    /**
     * The useBase virtualProp only
     * exists on Ionic components, so
     * we do not need to track useBase
     * on non-Ionic components.
     */
    let useBase = false;
    if (isIonicElement(baseEl)) {
      useBase = isBaseComponent(baseEl, config);
      baseEl.useBase = useBase;
    }

    while (elm) {
      const elmMode = (elm as any).mode || elm.getAttribute('mode');
      if (elmMode) {
        if (isAllowedIonicModeValue(elmMode)) {
          /**
           * The visual styles can deviate from the platform
           * capabilities if base components are enabled, so we keep
           * track of the platform separately.
           */
          baseEl.platform = elmMode;
          return useBase ? 'base' : elmMode;
        } else if (isIonicElement(elm)) {
          console.warn('Invalid ionic mode: "' + elmMode + '", expected: "ios" or "md"');
        }
      }
      elm = elm.parentElement;
    }

    /**
     * The visual styles can deviate from the platform
     * capabilities if base components are enabled, so we keep
     * track of the platform separately.
     */
    baseEl.platform = defaultMode;
    return useBase ? 'base' : defaultMode;
  });
};

export default initialize;
