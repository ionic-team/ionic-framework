import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColor: '#000000',
  textColor: '#ffffff',

  backgroundColorStep: {
    50: '#0d0d0d',
    100: '#1a1a1a',
    150: '#262626',
    200: '#333333',
    250: '#404040',
    300: '#4d4d4d',
    350: '#595959',
    400: '#666666',
    450: '#737373',
    500: '#808080',
    550: '#8c8c8c',
    600: '#999999',
    650: '#a6a6a6',
    700: '#b3b3b3',
    750: '#bfbfbf',
    800: '#cccccc',
    850: '#d9d9d9',
    900: '#e6e6e6',
    950: '#f2f2f2',
  },

  textColorStep: {
    50: '#f9f9f9',
    100: '#f3f3f3',
    150: '#ededed',
    200: '#e7e7e7',
    250: '#e1e1e1',
    300: '#dbdbdb',
    350: '#d5d5d5',
    400: '#cfcfcf',
    450: '#c9c9c9',
    500: '#c4c4c4',
    550: '#bebebe',
    600: '#b8b8b8',
    650: '#b2b2b2',
    700: '#acacac',
    750: '#a6a6a6',
    800: '#a0a0a0',
    850: '#9a9a9a',
    900: '#949494',
    950: '#8e8e8e',
  },
};
