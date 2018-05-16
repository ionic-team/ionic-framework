

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
