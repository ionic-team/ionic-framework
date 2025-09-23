import { mix } from '../../utils/theme';
import type { LightTheme } from '../themes.interfaces';

const colors = {
  primary: '#0054e9',
  secondary: '#0163aa',
  tertiary: '#6030ff',
  success: '#2dd55b',
  warning: '#ffc409',
  danger: '#c5000f',
  light: '#f4f5f8',
  medium: '#636469',
  dark: '#222428',
};

export const lightTheme: LightTheme = {
  color: {
    primary: {
      bold: {
        base: colors.primary,
        contrast: '#fff',
        foreground: mix(colors.primary, '#000', '12%'),
        shade: mix(colors.primary, '#000', '12%'),
        tint: mix(colors.primary, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.primary, '8%'),
        contrast: colors.primary,
        foreground: mix(colors.primary, '#000', '12%'),
        shade: mix('#fff', colors.primary, '12%'),
        tint: mix('#fff', colors.primary, '4%'),
      },
    },
    secondary: {
      bold: {
        base: colors.secondary,
        contrast: '#fff',
        foreground: mix(colors.secondary, '#000', '12%'),
        shade: mix(colors.secondary, '#000', '12%'),
        tint: mix(colors.secondary, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.secondary, '8%'),
        contrast: colors.secondary,
        foreground: mix(colors.secondary, '#000', '12%'),
        shade: mix('#fff', colors.secondary, '12%'),
        tint: mix('#fff', colors.secondary, '4%'),
      },
    },
    tertiary: {
      bold: {
        base: colors.tertiary,
        contrast: '#fff',
        foreground: mix(colors.tertiary, '#000', '12%'),
        shade: mix(colors.tertiary, '#000', '12%'),
        tint: mix(colors.tertiary, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.tertiary, '8%'),
        contrast: colors.tertiary,
        foreground: mix(colors.tertiary, '#000', '12%'),
        shade: mix('#fff', colors.tertiary, '12%'),
        tint: mix('#fff', colors.tertiary, '4%'),
      },
    },
    success: {
      bold: {
        base: colors.success,
        contrast: '#fff',
        foreground: mix(colors.success, '#000', '12%'),
        shade: mix(colors.success, '#000', '12%'),
        tint: mix(colors.success, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.success, '8%'),
        contrast: colors.success,
        foreground: mix(colors.success, '#000', '12%'),
        shade: mix('#fff', colors.success, '12%'),
        tint: mix('#fff', colors.success, '4%'),
      },
    },
    warning: {
      bold: {
        base: colors.warning,
        contrast: '#fff',
        foreground: mix(colors.warning, '#000', '12%'),
        shade: mix(colors.warning, '#000', '12%'),
        tint: mix(colors.warning, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.warning, '8%'),
        contrast: colors.warning,
        foreground: mix(colors.warning, '#000', '12%'),
        shade: mix('#fff', colors.warning, '12%'),
        tint: mix('#fff', colors.warning, '4%'),
      },
    },
    danger: {
      bold: {
        base: colors.danger,
        contrast: '#fff',
        foreground: mix(colors.danger, '#000', '12%'),
        shade: mix(colors.danger, '#000', '12%'),
        tint: mix(colors.danger, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.danger, '8%'),
        contrast: colors.danger,
        foreground: mix(colors.danger, '#000', '12%'),
        shade: mix('#fff', colors.danger, '12%'),
        tint: mix('#fff', colors.danger, '4%'),
      },
    },
    light: {
      bold: {
        base: colors.light,
        contrast: '#000',
        foreground: mix(colors.light, '#000', '12%'),
        shade: mix(colors.light, '#000', '12%'),
        tint: mix(colors.light, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.light, '8%'),
        contrast: colors.light,
        foreground: mix(colors.light, '#000', '12%'),
        shade: mix('#fff', colors.light, '12%'),
        tint: mix('#fff', colors.light, '4%'),
      },
    },
    medium: {
      bold: {
        base: colors.medium,
        contrast: '#fff',
        foreground: mix(colors.medium, '#000', '12%'),
        shade: mix(colors.medium, '#000', '12%'),
        tint: mix(colors.medium, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.medium, '8%'),
        contrast: colors.medium,
        foreground: mix(colors.medium, '#000', '12%'),
        shade: mix('#fff', colors.medium, '12%'),
        tint: mix('#fff', colors.medium, '4%'),
      },
    },
    dark: {
      bold: {
        base: colors.dark,
        contrast: '#fff',
        foreground: mix(colors.dark, '#000', '12%'),
        shade: mix(colors.dark, '#000', '12%'),
        tint: mix(colors.dark, '#fff', '10%'),
      },
      subtle: {
        base: mix('#fff', colors.dark, '8%'),
        contrast: colors.dark,
        foreground: mix(colors.dark, '#000', '12%'),
        shade: mix('#fff', colors.dark, '12%'),
        tint: mix('#fff', colors.dark, '4%'),
      },
    },
  },
};
