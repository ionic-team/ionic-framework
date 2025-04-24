import { defaultDarkTheme } from './dark.tokens';
import { defaultLightTheme } from './light.tokens';

export const defaultTheme = {
  palette: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
  // so far spacing is being used for
  // padding, margin, gap, border-width, height, width
  // should we create scale for height and width instead?
  // or keep it as is but change the keys to be numerical
  // like 0.5, 1, 1.5, 2, 2.5, 3, etc?
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
  radii: {
    none: '0',
    xs: '1px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px',
    xxl: '32px',
  },
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
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  lineHeights: {
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
