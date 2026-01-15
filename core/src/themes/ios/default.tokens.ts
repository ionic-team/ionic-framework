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
      margin: 'var(--ion-spacing-xxs)',
      padding: {
        vertical: 'var(--ion-spacing-xs)',
        horizontal: 'var(--ion-spacing-md)',
      },

      // Sizes
      size: {
        small: {
          minHeight: 'var(--ion-scaling-xs)',

          font: {
            size: clamp(
              'var(--ion-font-size-xs)',
              `${((fontSizes.chipBase - 2) / 16).toFixed(2)}rem`,
              'var(--ion-font-size-xl)'
            ),
          },
        },

        large: {
          minHeight: 'var(--ion-scaling-md)',

          font: {
            size: clamp('13px', `${(fontSizes.chipBase / 16).toFixed(2)}rem`, '22px'),
          },
        },
      },

      // States
      state: {
        disabled: {
          opacity: '0.4',
        },
      },

      // Shapes
      shape: {
        soft: {
          border: {
            radius: 'var(--ion-radii-md)',
          },
        },

        round: {
          border: {
            radius: 'var(--ion-radii-xxxxl)',
          },
        },

        rectangular: {
          border: {
            radius: 'var(--ion-radii-xxxxs)',
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
            bg: currentColor('base', 0.08),
            color: currentColor('shade'),

            state: {
              focus: {
                bg: currentColor('base', 0.12),
              },

              hover: {
                bg: currentColor('base', 0.12),
              },

              activated: {
                bg: currentColor('base', 0.16),
              },
            },
          },

          // default non-semantic states
          state: {
            focus: {
              bg: rgba(colors.textColorRgb, 0.16),
            },

            activated: {
              bg: rgba(colors.textColorRgb, 0.2),
            },

            hover: {
              bg: rgba(colors.textColorRgb, 0.16),
            },
          },
        },

        subtle: {
          bg: rgba(colors.textColorRgb, 0.05),
          color: rgba(colors.textColorRgb, 0.6),

          semantic: {
            bg: currentColor('base', null, true),
            color: currentColor('contrast', null, true),

            state: {
              focus: {
                bg: currentColor('base', 0.6, true),
              },

              hover: {
                bg: currentColor('base', 0.6, true),
              },

              activated: {
                bg: currentColor('base', 0.8, true),
              },
            },
          },

          // default non-semantic states
          state: {
            focus: {
              bg: rgba(colors.textColorRgb, 0.1),
            },

            activated: {
              bg: rgba(colors.textColorRgb, 0.14),
            },

            hover: {
              bg: rgba(colors.textColorRgb, 0.1),
            },
          },
        },
      },

      // Variants
      variant: {
        outline: {
          bg: 'transparent',

          border: {
            color: {
              bold: rgba(colors.textColorRgb, 0.32),
              subtle: rgba(colors.textColorRgb, 0.16),
            },

            width: 'var(--ion-border-width-xxs)',
          },

          semantic: {
            border: {
              color: {
                bold: currentColor('base', 0.32),
                subtle: currentColor('base', 0.12),
              },
            },
          },

          state: {
            focus: {
              bg: {
                bold: rgba(colors.textColorRgb, 0.04),
                subtle: rgba(colors.textColorRgb, 0.04),
              },
            },

            hover: {
              bg: {
                bold: rgba(colors.textColorRgb, 0.04),
                subtle: rgba(colors.textColorRgb, 0.04),
              },
            },

            activated: {
              bg: {
                bold: rgba(colors.textColorRgb, 0.08),
                subtle: rgba(colors.textColorRgb, 0.04),
              },
            },
          },
        },
      },

      icon: {
        size: `${(20 / fontSizes.chipBase).toFixed(2)}em`,
        color: rgba(colors.textColorRgb, 0.54),

        firstChild: {
          margin: {
            vertical: '-4px',
            start: '-4px',
            end: 'var(--ion-spacing-sm)',
          },
        },

        lastChild: {
          margin: {
            vertical: '-4px',
            start: 'var(--ion-spacing-sm)',
            end: '-4px',
          },
        },
      },

      avatar: {
        size: `${(24 / fontSizes.chipBase).toFixed(2)}em`,

        firstChild: {
          margin: {
            vertical: '-4px',
            start: '-8px',
            end: 'var(--ion-spacing-sm)',
          },
        },

        lastChild: {
          margin: {
            vertical: '-4px',
            start: 'var(--ion-spacing-sm)',
            end: '-8px',
          },
        },
      },
    },
  },
};
