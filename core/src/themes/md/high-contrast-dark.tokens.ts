import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColor: '#121212',
  textColor: '#000000',

  // TODO(FW-6864): Remove once IonToolbar themes are added
  toolbar: {
    background: '#1f1f1f',
  },

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
};
