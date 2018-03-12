export const SERVER_DOMAIN = `http://localhost:5454`;
export const DATA_URL = `${SERVER_DOMAIN}/data`;
export const COLOR_URL = `${SERVER_DOMAIN}/color`;
export const SAVE_CSS_URL = `${SERVER_DOMAIN}/save-css`;
export const DELETE_CSS_URL = `${SERVER_DOMAIN}/delete-css`;
export const CSS_THEME_FILE_PATH = `/src/themes/css`;

export function saveCssUrl (themeName: string, cssText: string) {
  cssText = encodeURIComponent(cssText);
  return `${SAVE_CSS_URL}?theme=${themeName}&css=${cssText}`;
}

export function deleteCssUrl (themeName: string) {
  return `${DELETE_CSS_URL}?theme=${themeName}`;
}

export function getThemeUrl (themeName: string) {
  return `${CSS_THEME_FILE_PATH}/${themeName}.css`;
}

export const STORED_DEMO_URL_KEY = 'theme-builder-demo-url';
export const STORED_DEMO_MODE_KEY = 'theme-builder-demo-mode';
export const STORED_THEME_KEY = 'theme-builder-theme-url';
