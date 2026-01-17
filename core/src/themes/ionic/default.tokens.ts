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
};

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'ionic',

  palette: {
    light: lightTheme,
    dark: darkTheme,
  },

  config: {
    formHighlight: true,
  },

  fontFamily:
    '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',

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
    lg: 'var(--ion-scaling-1000)',
    xl: 'var(--ion-scaling-1200)',
    xxl: 'var(--ion-scaling-1400)',
    xxxl: 'var(--ion-scaling-1800)',
    xxxxl: 'var(--ion-scaling-2000)',
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
    xxl: 'var(--ion-radii-500)',
    xxxl: 'var(--ion-radii-1000)',
    xxxxl: 'var(--ion-radii-full)',
  },

  components: {
    IonChip: {
      margin: 'var(--ion-spacing-0)',
      cursor: 'auto',

      padding: {
        vertical: 'var(--ion-spacing-xs)',
        horizontal: 'var(--ion-spacing-sm)',
      },

      lineHeight: '100%',
      fontWeight: 500,
      letterSpacing: '0%',
      gap: 'var(--ion-spacing-xxs)',

      // Sizes
      size: {
        small: {
          minHeight: 'var(--ion-scaling-xs)',
          font: {
            size: 'var(--ion-font-size-xs)',
          },
        },
        large: {
          minHeight: 'var(--ion-scaling-md)',
          font: {
            size: 'var(--ion-font-size-sm)',
          },
        },
      },

      // States
      state: {
        disabled: {
          opacity: '0.4',
        },
        focus: {
          ring: {
            color: '#b5c0f7',
            width: 'var(--ion-border-width-xxs)',
          },
        },
      },

      // Shapes
      shape: {
        soft: {
          border: {
            radius: 'var(--ion-radii-sm)',
          },
        },
        round: {
          border: {
            radius: 'var(--ion-radii-xl)',
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
            color: currentColor('contrast'),
            bg: currentColor('base'),
          },
        },

        subtle: {
          bg: rgba(colors.textColorRgb, 0.05),
          color: rgba(colors.textColorRgb, 0.6),

          semantic: {
            color: currentColor('contrast', null, true), // ADD THIS TO THE COMPONENT SCSS
            bg: currentColor('base', null, true), // ADD THIS TO THE COMPONENT SCSS
          },
        },
      },

      // Variants
      variant: {
        outline: {
          border: {
            color: {
              bold: rgba(colors.textColorRgb, 0.32),
              subtle: rgba(colors.textColorRgb, 0.16),
            },

            width: '1px',
          },

          semantic: {
            border: {
              color: {
                bold: currentColor('shade'),
                subtle: currentColor('shade', null, true),
              },
            },
          },
        },
      },

      icon: {
        size: 'var(--ion-scaling-xxxs)',
      },
    },
  },
};
