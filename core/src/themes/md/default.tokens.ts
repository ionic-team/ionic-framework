import { rgba, currentColor } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { highContrastDarkTheme } from './high-contrast-dark.tokens';
import { highContrastTheme } from './high-contrast.tokens';
import { lightTheme } from './light.tokens';

const fontSizes = {
  chipBase: 14,
};

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'md',

  palette: {
    light: lightTheme,
    dark: darkTheme,
    highContrast: highContrastTheme,
    highContrastDark: highContrastDarkTheme,
  },

  config: {
    formHighlight: true,
    rippleEffect: true,

    components: {
      IonChip: {
        hue: 'bold',
        shape: 'round',
        size: 'large',
      },
    },
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
      margin: 'var(--ion-spacing-xxs)',
      cursor: 'pointer',

      padding: {
        vertical: 'var(--ion-spacing-xs)',
        horizontal: 'var(--ion-spacing-md)',
      },

      // Sizes
      size: {
        small: {
          minHeight: 'var(--ion-scaling-xs)',

          font: {
            size: `${((fontSizes.chipBase - 2) / 16).toFixed(2)}rem`,
          },
        },
        large: {
          minHeight: 'var(--ion-scaling-md)',

          font: {
            size: `${(fontSizes.chipBase / 16).toFixed(2)}rem`,
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
          bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
          color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.87),

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
              bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.16), // default non-semantic focus bg for both hues
            },

            activated: {
              bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.2),
            },

            hover: {
              bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.16),
            },
          },
        },

        subtle: {
          bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.05),
          color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.6),

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
              bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.1),
            },

            activated: {
              bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.14),
            },

            hover: {
              bg: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.1),
            },
          },
        },
      },

      // Fills
      fill: {
        outline: {
          bg: 'transparent',

          border: {
            color: {
              bold: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.32),
              subtle: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.16),
            },

            width: 'var(--ion-border-width-xxxs)',
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
                bold: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
                subtle: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
              },
            },

            hover: {
              bg: {
                bold: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
                subtle: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
              },
            },

            activated: {
              bg: {
                bold: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.08),
                subtle: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
              },
            },
          },
        },
      },

      icon: {
        size: `${(20 / fontSizes.chipBase).toFixed(2)}em`,
        color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.54),

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
