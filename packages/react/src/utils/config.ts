import type { Config as CoreConfig } from '@ionic/core/components';

/**
 * Ionic's global config, or `null` before core has initialized. Kept here rather
 * than alongside the component helpers so that utils reaching for config don't
 * pull core's runtime bundle in with it.
 */
export const getConfig = (): CoreConfig | null => {
  if (typeof (window as any) !== 'undefined') {
    const Ionic = (window as any).Ionic;
    if (Ionic && Ionic.config) {
      return Ionic.config;
    }
  }
  return null;
};
