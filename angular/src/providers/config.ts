import { Config as CoreConfig } from '@ionic/core';
import { Injectable } from '@angular/core';

@Injectable()
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

function getConfig(): CoreConfig {
  const Ionic = (window as any).Ionic;
  if (Ionic && Ionic.config) {
    return Ionic.config;
  }
  return null;
}
