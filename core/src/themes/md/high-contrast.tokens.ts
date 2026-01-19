import { highContrastTheme as baseHighContrastTheme } from '../base/high-contrast.tokens';
import type { HighContrastTheme } from '../themes.interfaces';

export const highContrastTheme: HighContrastTheme = {
  ...baseHighContrastTheme,

  backgroundColor: '#ffffff',
  textColor: '#000000',

  backgroundColorStep: {
    50: '#818181',
    100: '#7a7a7a',
    150: '#747474',
    200: '#6d6d6d',
    250: '#666666',
    300: '#5f5f5f',
    350: '#585858',
    400: '#525252',
    450: '#4b4b4b',
    500: '#444444',
    550: '#3d3d3d',
    600: '#363636',
    650: '#303030',
    700: '#292929',
    750: '#222222',
    800: '#1b1b1b',
    850: '#141414',
    900: '#0e0e0e',
    950: '#070707',
  },

  textColorStep: {
    50: '#070707',
    100: '#0e0e0e',
    150: '#141414',
    200: '#1b1b1b',
    250: '#222222',
    300: '#292929',
    350: '#303030',
    400: '#363636',
    450: '#3d3d3d',
    500: '#444444',
    550: '#4b4b4b',
    600: '#525252',
    650: '#585858',
    700: '#5f5f5f',
    750: '#666666',
    800: '#6d6d6d',
    850: '#747474',
    900: '#7a7a7a',
    950: '#818181',
  },
};
