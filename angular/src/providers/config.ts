import { Config as CoreConfig } from '@ionic/core';

export class Config {

  constructor(defaultConfig: {[key: string]: any}) {
    const Ionic = (window as any).Ionic;
    if (Ionic.config && Ionic.config.constructor.name !== 'Object') {
      console.error('ionic config was already initialized');
      return;
    }
    Ionic.config = {
      ...Ionic.config,
      ...defaultConfig
    };
  }

  get(key: string, fallback?: any): any {
    return getConfig().get(key, fallback);
  }

  getBoolean(key: string, fallback?: boolean): boolean {
    return getConfig().getBoolean(key, fallback);
  }

  getNumber(key: string, fallback?: number): number {
    return getConfig().getNumber(key, fallback);
  }

  set(key: string, value?: any) {
    getConfig().set(key, value);
  }
}

function getConfig(): CoreConfig {
  const Ionic = (window as any).Ionic;
  if (Ionic && Ionic.config) {
    return Ionic.config;
  }
  return null;
}
