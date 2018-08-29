import { IonicConfig } from '../interface';

export function setupConfig(config: IonicConfig) {
  const win = window as any;
  const Ionic = win.Ionic;
  if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
    console.error('ionic config was already initialized');
    return;
  }
  win.Ionic = win.Ionic || {};
  win.Ionic.config = {
    ...win.Ionic.config,
    ...config
  };
  return win.Ionic.config;
}

const IONIC_PREFIX = 'ionic:';
const IONIC_SESSION_KEY = 'ionic-persist-config';

export function configFromSession(): any {
  try {
    const configStr = window.sessionStorage.getItem(IONIC_SESSION_KEY);
    return configStr ? JSON.parse(configStr) : {};
  } catch {
    return {};
  }
}

export function saveConfig(config: any) {
  try {
    window.sessionStorage.setItem(IONIC_SESSION_KEY, JSON.stringify(config));
  } catch {
    return;
  }
}

export function configFromURL() {
  const config: any = {};
  const win = window;
  win.location.search.slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    .filter(([key]) => startsWith(key, IONIC_PREFIX))
    .map(([key, value]) => [key.slice(IONIC_PREFIX.length), value])
    .forEach(([key, value]) => {
      config[key] = value;
    });

  return config;
}

function startsWith(input: string, search: string): boolean {
  return input.substr(0, search.length) === search;
}
