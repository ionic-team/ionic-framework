import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import type { DarkTheme } from '../themes.interfaces';

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

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
    500: '#898989',
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
    50: '#f2f2f2',
    100: '#e6e6e6',
    150: '#d9d9d9',
    200: '#cccccc',
    250: '#bfbfbf',
    300: '#b3b3b3',
    350: '#a6a6a6',
    400: '#999999',
    450: '#8c8c8c',
    500: '#808080',
    550: '#737373',
    600: '#666666',
    650: '#595959',
    700: '#4d4d4d',
    750: '#404040',
    800: '#333333',
    850: '#262626',
    900: '#1a1a1a',
    950: '#0d0d0d',
  },

  components: {
    IonCard: {
      background: '#1c1c1d',
    },
    IonItem: {
      background: '#000000',
    },
    IonModal: {
      background: 'var(--ion-background-color-step-100)',
      toolbarBackground: 'var(--ion-background-color-step-150)',
      toolbarBorderColor: 'var(--ion-background-color-step-250)',
    },
  },
};
