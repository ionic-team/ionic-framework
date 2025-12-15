import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColor: '#121212',
  textColor: '#000000',

  backgroundColorStep: {
    50: '#1e1e1e',
    100: '#2a2a2a',
    150: '#363636',
    200: '#414141',
    250: '#4d4d4d',
    300: '#595959',
    350: '#656565',
    400: '#717171',
    450: '#7d7d7d',
    500: '#898989',
    550: '#949494',
    600: '#a0a0a0',
    650: '#acacac',
    700: '#b8b8b8',
    750: '#c4c4c4',
    800: '#d0d0d0',
    850: '#dbdbdb',
    900: '#e7e7e7',
    950: '#f3f3f3',
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
