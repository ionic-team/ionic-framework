import { Config as CoreConfig } from '@ionic/core';
import { InjectionToken } from '@angular/core';

export class Config {

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

export const ConfigToken = new InjectionToken<any>('USERCONFIG');

function getConfig(): CoreConfig {
  const Ionic = (window as any).Ionic;
  if (Ionic && Ionic.config) {
    return Ionic.config;
  }
  return null;
}
