import { rgba, currentColor } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';

const colors = {
  backgroundColor: 'var(--ion-background-color, #fff)',
  backgroundColorRgb: 'var(--ion-background-color-rgb, 255, 255, 255)',
  textColor: 'var(--ion-text-color, #000)',
  textColorRgb: 'var(--ion-text-color-rgb, 0, 0, 0)',
}

const fontSizes = {
  chipBase: 14,
}

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'md',

  palette: {
    light: lightTheme,
    dark: darkTheme,
  },

  config: {
    formHighlight: true,
    rippleEffect: true,
  },

  fontFamily: '"Roboto", "Helvetica Neue", sans-serif',

  spacing: {
    xxxxs: 'var(--ion-spacing-25)',
    xxxs: 'var(--ion-spacing-50)',
    xxs: 'var(--ion-spacing-100)',
    xs: 'var(--ion-spacing-150)',
    sm: 'var(--ion-spacing-200)',
    md: 'var(--ion-spacing-300)',
    lg: 'var(--ion-spacing-400)',
    xl: 'var(--ion-spacing-500)',
    xxl: 'var(--ion-spacing-600)',
    xxxl: 'var(--ion-spacing-700)',
    xxxxl: 'var(--ion-spacing-800)',
  },

  scaling: {
    xxxxs: 'var(--ion-scaling-300)',
    xxxs: 'var(--ion-scaling-400)',
    xxs: 'var(--ion-scaling-500)',
    xs: 'var(--ion-scaling-600)',
    sm: 'var(--ion-scaling-700)',
    md: 'var(--ion-scaling-800)',
    lg: 'var(--ion-scaling-900)',
    xl: 'var(--ion-scaling-1000)',
    xxl: 'var(--ion-scaling-1100)',
    xxxl: 'var(--ion-scaling-1200)',
    xxxxl: 'var(--ion-scaling-1600)',
  },

  borderWidth: {
    xxxxs: 'var(--ion-border-width-0)',
    xxxs: 'var(--ion-border-width-25)',
    xxs: 'var(--ion-border-width-50)',
    xs: 'var(--ion-border-width-75)',
    sm: 'var(--ion-border-width-100)',
    md: 'var(--ion-border-width-150)',
    lg: 'var(--ion-border-width-200)',
    xl: 'var(--ion-border-width-250)',
    xxl: 'var(--ion-border-width-300)',
    xxxl: 'var(--ion-border-width-350)',
    xxxxl: 'var(--ion-border-width-400)',
  },

  radii: {
    xxxxs: 'var(--ion-radii-0)',
    xxxs: 'var(--ion-radii-25)',
    xxs: 'var(--ion-radii-50)',
    xs: 'var(--ion-radii-75)',
    sm: 'var(--ion-radii-100)',
    md: 'var(--ion-radii-200)',
    lg: 'var(--ion-radii-300)',
    xl: 'var(--ion-radii-400)',
    xxl: 'var(--ion-radii-700)',
    xxxl: 'var(--ion-radii-900)',
    xxxxl: 'var(--ion-radii-full)',
  },

  components: {
    IonChip: {
      margin: '4px',
      paddingVertical: '6px',
      paddingHorizontal: '12px',

      // Sizes
      size: {
        small: {
          height: '24px',
          fontSize: `${(fontSizes.chipBase - 2) / 16}rem`,
        },
        medium: {
          height: '32px',
          fontSize: `${fontSizes.chipBase / 16}rem`,
        },
        large: {
          height: '32px',
          fontSize: `${(fontSizes.chipBase + 2) / 16}rem`,
        },
      },

      // States
      state: {
        disabled: {
          opacity: '0.4',
        },
        focus: {
          bg: rgba(colors.textColorRgb, 0.16),
          semanticBg: currentColor('base', 0.12),
          outlineBg: rgba(colors.textColorRgb, 0.04),
        },
        activated: {
          bg: rgba(colors.textColorRgb, 0.2),
          semanticBg: currentColor('base', 0.16),
        },
        hover: {
          bg: rgba(colors.textColorRgb, 0.16),
          semanticBg: currentColor('base', 0.12),
          outlineBg: rgba(colors.textColorRgb, 0.04),
        },
      },

      // Shapes
      shape: {
        soft: {
          borderRadius: 'var(--ion-radii-200)',
        },
        round: {
          borderRadius: 'var(--ion-radii-full)',
        },
        rectangular: {
          borderRadius: 'var(--ion-radii-0)',
        },
      },

      // Hues
      hue: {
        bold: {
          bg: rgba(colors.textColorRgb, 0.12),
          color: rgba(colors.textColorRgb, 0.87),

          outline: {
            borderColor: rgba(colors.textColorRgb, 0.32),
          },

          // Any of the semantic colors like primary, secondary, etc.
          semantic: {
            bgAlpha: '0.08',
            color: currentColor('shade'),

            outline: {
              borderColor: currentColor('base', 0.32),
            }
          },
        },
        subtle: {
          bg: rgba(colors.textColorRgb, 0.04),
          color: rgba(colors.textColorRgb, 0.87),

          outline: {
            borderColor: rgba(colors.textColorRgb, 0.32),
          },
        },
      },

      // Variants
      variant: {
        outline: {
          borderWidth: '1px',
          bg: 'transparent',
        },
      },

      icon: {
        size: `${20 / fontSizes.chipBase}em`,
        color: rgba(colors.textColorRgb, 0.54),
        firstChildMargin: '-4px',
        firstChildMarginEnd: '8px',
        lastChildMargin: '-4px',
        lastChildMarginStart: '8px',
      },

      avatar: {
        size: `${24 / fontSizes.chipBase}em`,
        firstChildMarginVertical: '-4px',
        firstChildMarginStart: '-8px',
        firstChildMarginEnd: '8px',
        lastChildMarginVertical: '-4px',
        lastChildMarginStart: '8px',
        lastChildMarginEnd: '-8px',
      },
    },
  }
};
