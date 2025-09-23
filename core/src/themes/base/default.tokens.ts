import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';

export const defaultTheme: DefaultTheme = {
  palette: {
    light: lightTheme,
    dark: darkTheme,
  },

  spacing: {
    none: '0',
    xxs: '4px',
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  scaling: {
    0: '0',
    100: '4px',
    150: '6px',
    200: '8px',
    250: '10px',
    300: '12px',
    350: '14px',
    400: '16px',
    450: '18px',
    500: '20px',
    550: '22px',
    600: '24px',
    650: '26px',
    700: '28px',
    750: '30px',
    800: '32px',
    850: '34px',
    900: '36px',
  },

  borderWidth: {
    none: '0',
    xxs: '1px',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    xxl: '12px',
  },

  radii: {
    none: '0',
    xxs: '1px',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '32px',
  },

  fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  dynamicFont: '-apple-system-body',

  fontSize: {
    root: '16px',
    xxs: '10px',
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },

  fontWeight: {
    thin: '100',
    extraLight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },

  lineHeight: {
    xxs: '1',
    xs: '1.2',
    sm: '1.4',
    md: '1.6',
    lg: '1.8',
    xl: '2',
    xxl: '2.4',
  },
};
