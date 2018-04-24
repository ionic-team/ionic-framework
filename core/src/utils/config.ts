
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

export function configFromURL() {
  const config: any = {};
  const win = window;
  win.location.search.slice(1)
    .split('&')
    .filter(entryText => entryText.startsWith('ionic:'))
    .map(entryText => entryText.split('='))
    .forEach(entry => {
      config[entry[0].slice(6)] = decodeURIComponent(entry[1]);
    });

  return config;
}
