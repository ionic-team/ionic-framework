import { mix, generateColorSteps } from '../../utils/theme';
import type { DarkTheme } from '../themes.interfaces';

const colors = {
  primary: '#4d8dff',
  secondary: '#46b1ff',
  tertiary: '#8482fb',
  success: '#2dd55b',
  warning: '#ffce31',
  danger: '#f24c58',
  light: '#222428',
  medium: '#989aa2',
  dark: '#f4f5f8',
  gray: generateColorSteps('#000000', '#ffffff', true),
};

export const darkTheme: DarkTheme = {
  enabled: 'never',
  color: {
    primary: {
      bold: {
        base: colors.primary,
        contrast: '#000',
        foreground: mix(colors.primary, '#000', '4%'),
        shade: mix(colors.primary, '#000', '4%'),
        tint: mix(colors.primary, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.primary, '8%'),
        contrast: colors.primary,
        foreground: mix(colors.primary, '#000', '4%'),
        shade: mix('#000', colors.primary, '4%'),
        tint: mix('#000', colors.primary, '12%'),
      },
    },
    secondary: {
      bold: {
        base: colors.secondary,
        contrast: '#000',
        foreground: mix(colors.secondary, '#000', '4%'),
        shade: mix(colors.secondary, '#000', '4%'),
        tint: mix(colors.secondary, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.secondary, '8%'),
        contrast: colors.secondary,
        foreground: mix(colors.secondary, '#000', '4%'),
        shade: mix('#000', colors.secondary, '4%'),
        tint: mix('#000', colors.secondary, '12%'),
      },
    },
    tertiary: {
      bold: {
        base: colors.tertiary,
        contrast: '#000',
        foreground: mix(colors.tertiary, '#000', '4%'),
        shade: mix(colors.tertiary, '#000', '4%'),
        tint: mix(colors.tertiary, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.tertiary, '8%'),
        contrast: colors.tertiary,
        foreground: mix(colors.tertiary, '#000', '4%'),
        shade: mix('#000', colors.tertiary, '4%'),
        tint: mix('#000', colors.tertiary, '12%'),
      },
    },
    success: {
      bold: {
        base: colors.success,
        contrast: '#000',
        foreground: mix(colors.success, '#000', '4%'),
        shade: mix(colors.success, '#000', '4%'),
        tint: mix(colors.success, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.success, '8%'),
        contrast: colors.success,
        foreground: mix(colors.success, '#000', '4%'),
        shade: mix('#000', colors.success, '4%'),
        tint: mix('#000', colors.success, '12%'),
      },
    },
    warning: {
      bold: {
        base: colors.warning,
        contrast: '#000',
        foreground: mix(colors.warning, '#000', '4%'),
        shade: mix(colors.warning, '#000', '4%'),
        tint: mix(colors.warning, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.warning, '8%'),
        contrast: colors.warning,
        foreground: mix(colors.warning, '#000', '4%'),
        shade: mix('#000', colors.warning, '4%'),
        tint: mix('#000', colors.warning, '12%'),
      },
    },
    danger: {
      bold: {
        base: colors.danger,
        contrast: '#000',
        foreground: mix(colors.danger, '#000', '4%'),
        shade: mix(colors.danger, '#000', '4%'),
        tint: mix(colors.danger, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.danger, '8%'),
        contrast: colors.danger,
        foreground: mix(colors.danger, '#000', '4%'),
        shade: mix('#000', colors.danger, '4%'),
        tint: mix('#000', colors.danger, '12%'),
      },
    },
    light: {
      bold: {
        base: colors.light,
        contrast: '#fff',
        foreground: mix(colors.light, '#000', '4%'),
        shade: mix(colors.light, '#000', '4%'),
        tint: mix(colors.light, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.light, '8%'),
        contrast: colors.light,
        foreground: mix(colors.light, '#000', '4%'),
        shade: mix('#000', colors.light, '4%'),
        tint: mix('#000', colors.light, '12%'),
      },
    },
    medium: {
      bold: {
        base: colors.medium,
        contrast: '#000',
        foreground: mix(colors.medium, '#000', '4%'),
        shade: mix(colors.medium, '#000', '4%'),
        tint: mix(colors.medium, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.medium, '8%'),
        contrast: colors.medium,
        foreground: mix(colors.medium, '#000', '4%'),
        shade: mix('#000', colors.medium, '4%'),
        tint: mix('#000', colors.medium, '12%'),
      },
    },
    dark: {
      bold: {
        base: colors.dark,
        contrast: '#000',
        foreground: mix(colors.dark, '#000', '4%'),
        shade: mix(colors.dark, '#000', '4%'),
        tint: mix(colors.dark, '#fff', '12%'),
      },
      subtle: {
        base: mix('#000', colors.dark, '8%'),
        contrast: colors.dark,
        foreground: mix(colors.dark, '#000', '4%'),
        shade: mix('#000', colors.dark, '4%'),
        tint: mix('#000', colors.dark, '12%'),
      },
    },
    gray: colors.gray,
  },

  backgroundColor: '#000000',
  backgroundColorRgb: '0, 0, 0',
  textColor: '#ffffff',
  textColorRgb: '255, 255, 255',

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
  },
};
