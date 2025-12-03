import { generateColorSteps, mix } from '../../utils/theme';
import type { HighContrastTheme } from '../themes.interfaces';

const colors = {
  primary: '#003fae',
  secondary: '#01487b',
  tertiary: '#3400e6',
  success: '#004314',
  warning: '#5f4100',
  danger: '#9c000c',
  light: '#f4f5f8',
  medium: '#444446',
  dark: '#222428',
};

export const highContrastTheme: HighContrastTheme = {
  enabled: 'never',
  color: {
    primary: {
      bold: {
        base: colors.primary,
        contrast: '#fff',
        foreground: colors.primary,
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
        foreground: colors.secondary,
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
        foreground: colors.tertiary,
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
        foreground: colors.success,
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
        foreground: colors.warning,
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
        foreground: colors.danger,
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
        foreground: colors.light,
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
        foreground: colors.medium,
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
        foreground: colors.dark,
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
    text: generateColorSteps('#888888', '#000000'),
  },

  backgroundColor: '#ffffff',
  backgroundColorRgb: '255, 255, 255',
  textColor: '#000000',
  textColorRgb: '0, 0, 0',
};
