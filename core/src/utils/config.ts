

export function setupConfig(config: {[key: string]: any}) {
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

export function configFromURL() {
  const config: any = {};
  const win = window;
  win.location.search.slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    .filter(([key]) => key.startsWith(IONIC_PREFIX))
    .map(([key, value]) => [key.slice(IONIC_PREFIX.length), value])
    .forEach(([key, value]) => {
      config[key] = value;
    });

  return config;
}
