import type { IonicConfig } from '../themes/themes.interfaces';

// TODO(FW-2832): types

export class Config {
  private m = new Map<keyof IonicConfig, any>();

  reset(configObj: IonicConfig) {
    this.m = new Map<keyof IonicConfig, any>(Object.entries(configObj) as any);
  }

  get(key: keyof IonicConfig, fallback?: any): any {
    const value = this.m.get(key);
    return value !== undefined ? value : fallback;
  }

  /**
   * Get a nested object value from the config
   *
   * @param key Nested key string (e.g., 'IonChip.size')
   * @param fallback Default value if the key is not found
   * @returns The value found at the nested key or the fallback
   */
  getObjectValue(key: string, fallback?: string): string | undefined {
    const [firstKey, ...remainingKeys] = key.split('.');

    let root: any;
    // First key is a component config since it starts with 'Ion',
    // it must be accessed from the 'customTheme' config object
    if (firstKey.startsWith('Ion')) {
      const customTheme = this.m.get('customTheme');
      root = customTheme ? customTheme.config[firstKey as keyof IonicConfig] : undefined;
    } else {
      // Otherwise, get the value directly from the global config
      root = this.m.get(firstKey as keyof IonicConfig);
    }

    if (root === undefined) {
      return fallback;
    }

    const result = remainingKeys.reduce((acc, k) => acc?.[k], root);

    return result ?? fallback;
  }

  getBoolean(key: keyof IonicConfig, fallback = false): boolean {
    const val = this.m.get(key);
    if (val === undefined) {
      return fallback;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  getNumber(key: keyof IonicConfig, fallback?: number): number {
    const val = parseFloat(this.m.get(key));
    return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  set(key: keyof IonicConfig, value: any) {
    this.m.set(key, value);
  }
}

export const config = /*@__PURE__*/ new Config();

export const configFromSession = (win: Window): any => {
  try {
    const configStr = win.sessionStorage.getItem(IONIC_SESSION_KEY);
    return configStr !== null ? JSON.parse(configStr) : {};
  } catch (e) {
    return {};
  }
};

export const saveConfig = (win: Window, c: any) => {
  try {
    win.sessionStorage.setItem(IONIC_SESSION_KEY, JSON.stringify(c));
  } catch (e) {
    return;
  }
};

export const configFromURL = (win: Window) => {
  const configObj: any = {};
  win.location.search
    .slice(1)
    .split('&')
    .map((entry) => entry.split('='))
    .map(([key, value]) => {
      try {
        return [decodeURIComponent(key), decodeURIComponent(value)];
      } catch (e) {
        return ['', ''];
      }
    })
    .filter(([key]) => startsWith(key, IONIC_PREFIX))
    .map(([key, value]) => [key.slice(IONIC_PREFIX.length), value])
    .forEach(([key, value]) => {
      configObj[key] = value;
    });

  return configObj;
};

const startsWith = (input: string, search: string): boolean => {
  return input.substr(0, search.length) === search;
};

const IONIC_PREFIX = 'ionic:';
const IONIC_SESSION_KEY = 'ionic-persist-config';
