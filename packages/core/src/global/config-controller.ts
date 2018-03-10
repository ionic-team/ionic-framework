import { Config } from '../index';
import { PlatformConfig, readQueryParam } from './platform-configs';
import { isDef } from '../utils/helpers';

export function createConfigController(configObj: any, platforms: PlatformConfig[]): Config {
  configObj = configObj || {};

  function get(key: string, fallback?: any): any {

    const queryValue = readQueryParam(window.location.href, `ionic${key}`);
    if (isDef(queryValue)) {
      return configObj[key] = (queryValue === 'true' ? true : queryValue === 'false' ? false : queryValue);
    }

    if (isDef(configObj[key])) {
      return configObj[key];
    }

    let settings: any = null;

    for (let i = 0; i < platforms.length; i++) {
      settings = platforms[i]['settings'];
      if (settings && isDef(settings[key])) {
        return settings[key];
      }
    }

    return fallback !== undefined ? fallback : null;
  }

  function getBoolean(key: string, fallback?: boolean): boolean {
    const val = get(key);
    if (val === null) {
      return fallback !== undefined ? fallback : false;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  function getNumber(key: string, fallback?: number): number {
    const val = parseFloat(get(key));
    return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  return {
    get,
    getBoolean,
    getNumber
  };
}
