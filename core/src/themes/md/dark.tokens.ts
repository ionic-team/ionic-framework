import { generateColorSteps } from '../../utils/theme';
import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import type { DarkTheme } from '../themes.interfaces';

const graySteps = generateColorSteps('#ffffff', '#121212', true);

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

  backgroundColor: '#121212',
  backgroundColorRgb: '18, 18, 18',
  textColor: '#ffffff',
  textColorRgb: '255, 255, 255',

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
    50: '#f3f3f3',
    100: '#e7e7e7',
    150: '#dbdbdb',
    200: '#d0d0d0',
    250: '#c4c4c4',
    300: '#b8b8b8',
    350: '#acacac',
    400: '#a0a0a0',
    450: '#949494',
    500: '#898989',
    550: '#7d7d7d',
    600: '#717171',
    650: '#656565',
    700: '#595959',
    750: '#4d4d4d',
    800: '#414141',
    850: '#363636',
    900: '#2a2a2a',
    950: '#1e1e1e',
  },

  color: {
    // TODO: Update hex values to use the text color variable and background color variable
    gray: graySteps,
  },

  components: {
    IonCard: {
      background: '#1e1e1e',
    },
    IonItem: {
      background: '#1e1e1e',
    },
    IonToolbar: {
      background: '#1f1f1f',
    },
    IonTabBar: {
      background: '#1f1f1f',
    },
    IonDatetime: {
      bg: graySteps['100']!,
      timeBodyBg: graySteps['300']!,
    },
  },
};
