import { defaultDarkTheme } from './dark.tokens';
import { defaultLightTheme } from './light.tokens';

export const defaultTheme = {
  palette: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
  // so far spacing is being used for
  // padding, margin, gap, border-width, height, width
  spacing: {
    none: '0',
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px',
  },
  // scaling is used for width and height
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
  radii: {
    none: '0',
    xs: '1px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px',
    xxl: '32px',
  },
  dynamicFont: '-apple-system-body',
  fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  fontWeights: {
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
  fontSizes: {
    root: '16px',
    xxs: '10px',
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  lineHeights: {
    xxs: '1',
    xs: '1.2',
    sm: '1.4',
    md: '1.6',
    lg: '1.8',
    xl: '2',
    xxl: '2.4',
  },
  components: {},
};

export type Theme = typeof defaultTheme;
