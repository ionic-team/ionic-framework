import { ConfigApi } from '../index';
import { PlatformConfig } from './platform-configs';


export function createConfigController(configObj: any, platforms: PlatformConfig[]): ConfigApi {
  configObj = configObj || {};

  function get(key: string, fallback?: any): any {
    if (configObj[key] !== undefined) {
      return configObj[key];
    }

    let settings: any = null;

    for (let i = 0; i < platforms.length; i++) {
      settings = platforms[i]['settings'];
      if (settings && settings[key] !== undefined) {
        return settings[key];
      }
    }

    return fallback !== undefined ? fallback : null;
  }

  function getBoolean(key: string, fallback: boolean): boolean {
    const val = get(key);
    if (val === null) {
      return fallback !== undefined ? fallback : false;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  function getNumber(key: string, fallback: number): number {
    const val = parseFloat(get(key));
    return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  return {
    get: get,
    getBoolean: getBoolean,
    getNumber: getNumber
  };
}
