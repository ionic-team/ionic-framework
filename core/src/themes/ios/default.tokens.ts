import { rgba, currentColor, clamp } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';

const colors = {
  backgroundColor: 'var(--ion-background-color, #fff)',
  backgroundColorRgb: 'var(--ion-background-color-rgb, 255, 255, 255)',
  textColor: 'var(--ion-text-color, #000)',
  textColorRgb: 'var(--ion-text-color-rgb, 0, 0, 0)',
};

const fontSizes = {
  chipBase: 14,
};

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'ios',

  palette: {
    light: lightTheme,
    dark: darkTheme,
  },

  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif',

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
    xxxxs: 'var(--ion-scaling-200)',
    xxxs: 'var(--ion-scaling-350)',
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
    xxxs: 'var(--ion-border-width-hairline)',
    xxs: 'var(--ion-border-width-25)',
    xs: 'var(--ion-border-width-50)',
    sm: 'var(--ion-border-width-75)',
    md: 'var(--ion-border-width-100)',
    lg: 'var(--ion-border-width-150)',
    xl: 'var(--ion-border-width-200)',
    xxl: 'var(--ion-border-width-250)',
    xxxl: 'var(--ion-border-width-300)',
    xxxxl: 'var(--ion-border-width-350)',
  },

  radii: {
    xxxxs: 'var(--ion-radii-0)',
    xxxs: 'var(--ion-radii-50)',
    xxs: 'var(--ion-radii-100)',
    xs: 'var(--ion-radii-150)',
    sm: 'var(--ion-radii-200)',
    md: 'var(--ion-radii-250)',
    lg: 'var(--ion-radii-300)',
    xl: 'var(--ion-radii-350)',
    xxl: 'var(--ion-radii-400)',
    xxxl: 'var(--ion-radii-500)',
    xxxxl: 'var(--ion-radii-full)',
  },

  components: {
    IonChip: {
      margin: '4px',
      padding: {
        vertical: '6px',
        horizontal: '12px',
      },

      // Sizes
      size: {
        small: {
          height: '24px',

          font: {
            size: clamp('12px', `${(fontSizes.chipBase - 2) / 16}rem`, '20px'),
          },
        },

        large: {
          height: '32px',

          font: {
            size: clamp('14px', `${(fontSizes.chipBase + 2) / 16}rem`, '24px'),
          },
        },
      },

      // States
      state: {
        disabled: {
          opacity: '0.4',
        },

        focus: {
          bg: rgba(colors.textColorRgb, 0.16), // default non-semantic focus bg for both hues
        },

        activated: {
          bg: rgba(colors.textColorRgb, 0.2),
          semantic: {
            bg: currentColor('base', 0.16),
          },
        },

        hover: {
          bg: rgba(colors.textColorRgb, 0.16),
          semantic: {
            bg: currentColor('base', 0.12),
          },
        },
      },

      // Shapes
      shape: {
        soft: {
          border: {
            radius: 'var(--ion-radii-250)',
          },
        },

        round: {
          border: {
            radius: 'var(--ion-radii-full)',
          },
        },

        rectangular: {
          border: {
            radius: 'var(--ion-radii-0)',
          },
        },
      },

      // Hues
      hue: {
        bold: {
          bg: rgba(colors.textColorRgb, 0.12),
          color: rgba(colors.textColorRgb, 0.87),

          // Any of the semantic colors like primary, secondary, etc.
          semantic: {
            bgAlpha: '0.08',
            color: currentColor('shade'),
          },
        },

        subtle: {
          bg: rgba(colors.textColorRgb, 0.04), // making this up since ionic subtle does not use textColorRgb
          color: rgba(colors.textColorRgb, 0.83), // making this up since ionic subtle does not use textColorRgb
        },
      },

      // Variants
      variant: {
        outline: {
          bg: 'transparent',

          border: {
            width: '1px',
          },

          state: {
            focus: {
              bg: {
                bold: rgba(colors.textColorRgb, 0.04),
                subtle: rgba(colors.textColorRgb, 0.02), // making this up since md subtle doesn't exist yet
              },
            },

            hover: {
              bg: {
                bold: rgba(colors.textColorRgb, 0.04),
                subtle: rgba(colors.textColorRgb, 0.02), // making this up since md subtle doesn't exist yet
              },
            },
          },
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
  },
};
