
export const THEME_VARIABLES = [

  {
    property: '--primary'
  },
  {
    property: '--primary-contrast'
  },
  {
    property: '--secondary'
  },
  {
    property: '--secondary-contrast'
  },
  {
    property: '--tertiary'
  },
  {
    property: '--tertiary-contrast'
  },
  {
    property: '--success'
  },
  {
    property: '--success-contrast'
  },
  {
    property: '--warning'
  },
  {
    property: '--warning-contrast'
  },
  {
    property: '--danger'
  },
  {
    property: '--danger-contrast'
  },
  {
    property: '--light'
  },
  {
    property: '--light-contrast'
  },
  {
    property: '--medium'
  },
  {
    property: '--medium-contrast'
  },
  {
    property: '--dark'
  },
  {
    property: '--dark-contrast'
  },
  {
    property: '--content-color'
  },
  {
    property: '--content-sub-color'
  },
  {
    property: '--content-background'
  },
  {
    property: '--content-sub-background'
  },
  {
    property: '--toolbar-background'
  },
  {
    property: '--tabbar-background'
  },
  {
    property: '--item-background'
  },
  {
    property: '--item-sub-background'
  },
  {
    property: '--border-color'
  },

];

export const SERVER_DOMAIN = `http://localhost:5454`;
export const DATA_URL = `${SERVER_DOMAIN}/data`;
export const SAVE_CSS_URL = `${SERVER_DOMAIN}/save-css`;
export const DELETE_CSS_URL = `${SERVER_DOMAIN}/delete-css`;
export const CSS_THEME_FILE_PATH = `/src/themes/css`;

export function saveCssUrl(themeName: string, cssText: string) {
  cssText = encodeURIComponent(cssText);
  return `${SAVE_CSS_URL}?theme=${themeName}&css=${cssText}`;
}

export function deleteCssUrl(themeName: string) {
  return `${DELETE_CSS_URL}?theme=${themeName}`;
}

export function getThemeUrl(themeName: string) {
  return `${CSS_THEME_FILE_PATH}/${themeName}.css`;
}

export const STORED_DEMO_URL_KEY = 'theme-builder-demo-url';
export const STORED_DEMO_MODE_KEY = 'theme-builder-demo-mode';
export const STORED_THEME_KEY = 'theme-builder-theme-url';
