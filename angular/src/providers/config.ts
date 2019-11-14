import { Injectable, InjectionToken } from '@angular/core';
import { Config as CoreConfig, IonicConfig } from '@ionic/core';

import { IonicWindow } from '../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class Config {

  get(key: keyof IonicConfig, fallback?: any): any {
    const c = getConfig();
    if (c) {
      return c.get(key, fallback);
    }
    return null;
  }

  getBoolean(key: keyof IonicConfig, fallback?: boolean): boolean {
    const c = getConfig();
    if (c) {
      return c.getBoolean(key, fallback);
    }
    return false;
  }

  getNumber(key: keyof IonicConfig, fallback?: number): number {
    const c = getConfig();
    if (c) {
      return c.getNumber(key, fallback);
    }
    return 0;
  }

  set(key: keyof IonicConfig, value?: any) {
    console.warn(`[DEPRECATION][Config]: The Config.set() method is deprecated and will be removed in Ionic Framework 6.0. Please see https://ionicframework.com/docs/angular/config for alternatives.`);
    const c = getConfig();
    if (c) {
      c.set(key, value);
    }
  }
}

export const ConfigToken = new InjectionToken<any>('USERCONFIG');

const getConfig = (): CoreConfig | null => {
  if (typeof (window as any) !== 'undefined') {
    const Ionic = (window as any as IonicWindow).Ionic;
    if (Ionic && Ionic.config) {
      return Ionic.config;
    }
  }
  return null;
};
