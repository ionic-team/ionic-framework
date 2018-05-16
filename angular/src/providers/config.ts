import { Config as CoreConfig } from '@ionic/core';
import { InjectionToken } from '@angular/core';
import { IonicWindow } from '../types/interfaces';


export class Config {

  get(key: string, fallback?: any): any {
    const c = getConfig();
    if (c) {
      return c.get(key, fallback);
    }
    return null;
  }

  getBoolean(key: string, fallback?: boolean): boolean {
    const c = getConfig();
    if (c) {
      return c.getBoolean(key, fallback);
    }
    return null;
  }

  getNumber(key: string, fallback?: number): number {
    const c = getConfig();
    if (c) {
      return c.getNumber(key, fallback);
    }
    return null;
  }

  set(key: string, value?: any) {
    const c = getConfig();
    if (c) {
      c.set(key, value);
    }
  }
}

export const ConfigToken = new InjectionToken<any>('USERCONFIG');

function getConfig(): CoreConfig {
  const win: IonicWindow = window as any;
  if (typeof win !== 'undefined') {
    const Ionic = win.Ionic;
    if (Ionic && Ionic.config) {
      return Ionic.config;
    }
  }
  return null;
}
