
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


export function cleanCssValue(value: string) {
  if (typeof value === 'string') {
    value = (value || '').trim().toLowerCase().replace(/ /g, '');

    if (value.length) {
      if (value.charAt(0) === '#') {
        return cleanHexValue(value);
      }

      if (value.charAt(0) === 'r') {
        return cleanRgb(value);
      }
    }
  }

  return '';
}

function cleanHexValue(value: string) {
  return '#' + value.substr(1).split('').map(c => {
    return /[a-f]|[0-9]/.test(c) ? c : '';
  }).join('').substr(0, 6);
}


function cleanRgb(value: string) {
  return value.split('').map(c => {
    return /[rgba0-9\,\.\(\)]/.test(c) ? c : '';
  }).join('');
}

export function isValidColorValue(value: string) {
  if (value) {
    if (value.charAt(0) === '#') {
      const rxValidHex = /^#[0-9a-f]{6}$/i;
      return rxValidHex.test(value);
    }
    if (value.charAt(0) === 'r') {
      const rxValidRgb = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i;
      return rxValidRgb.test(value);
    }
  }

  return false;
}
