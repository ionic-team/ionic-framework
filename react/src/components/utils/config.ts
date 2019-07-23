import { Config, IonicConfig } from '@ionic/core';

export function getConfig() {
  const coreConfig = getCoreConfig();
  const config: IonicConfig = Array.from((coreConfig as any).m).reduce((obj: any, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
  return config;
}

export function setConfig(config: IonicConfig) {
  const coreConfig = getCoreConfig();
  coreConfig.reset(config);
}

function getCoreConfig(): Config {
  if (typeof (window as any) !== 'undefined') {
    const Ionic = window.Ionic;
    if (Ionic && Ionic.config) {
      return window.Ionic.config;
    }
  }
  return null;
}
