import { generateColorSteps, mix } from '../../utils/theme';
import type { HighContrastDarkTheme } from '../themes.interfaces';

import { colors as defaultDarkColors } from './dark.tokens';
import { colors as defaultColors } from './default.tokens';

const colors = {
  primary: '#7cabff',
  secondary: '#62bdff',
  tertiary: '#b6b9f9',
  success: '#4ada71',
  warning: '#ffce31',
  danger: '#fc9aa2',
  light: '#222428',
  medium: '#a8aab3',
  dark: '#f4f5f8',
  gray: defaultDarkColors.gray,
};

export const highContrastDarkTheme: HighContrastDarkTheme = {
  enabled: 'never',
  color: {
    primary: {
      bold: {
        base: colors.primary,
        contrast: '#000',
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
        contrast: '#000',
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
        contrast: '#000',
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
        contrast: '#000',
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
        contrast: '#000',
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
        contrast: '#000',
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
        contrast: '#fff',
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
        contrast: '#000',
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
        contrast: '#000',
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
    gray: colors.gray,
    text: generateColorSteps('#ffffff', '#888888', true),
  },

  backgroundColor: defaultColors.black,
  backgroundColorRgb: '0, 0, 0',
  textColor: defaultColors.white,
  textColorRgb: '255, 255, 255',
};
