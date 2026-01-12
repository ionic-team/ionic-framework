import * as colorTokens from 'outsystems-design-tokens/tokens/color scheme.json';
import * as primitiveTokens from 'outsystems-design-tokens/tokens/primitives.json';
import * as lightTokens from 'outsystems-design-tokens/tokens/theme/light.json';
import * as typographyTokens from 'outsystems-design-tokens/tokens/typography.json';

import { currentColor, cachedResolveOsToken } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';

const tokenMap = {
  colorTokens,
  primitiveTokens,
  lightTokens,
  typographyTokens,
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
      margin: '0px',

      padding: {
        vertical: primitiveTokens.scale['150'].$value,
        horizontal: primitiveTokens.scale['200'].$value,
      },

      typography: cachedResolveOsToken(typographyTokens.body.sm.medium.$value, tokenMap),
      lineHeight: primitiveTokens.font['line-height']['full'].$value,
      gap: cachedResolveOsToken(primitiveTokens.space['100'].$value, tokenMap),

      // Sizes
      size: {
        small: {
          height: primitiveTokens.scale['600'].$value,
          font: {
            size: primitiveTokens.font['font-size']['300'].$value,
          },
        },
        large: {
          height: primitiveTokens.scale['800'].$value,
          font: {
            size: primitiveTokens.font['font-size']['350'].$value,
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
            color: lightTokens.primitives.blue['400'].$value,
            width: primitiveTokens.scale['050'].$value,
          },
        },
      },

      // Shapes
      shape: {
        soft: {
          border: {
            radius: primitiveTokens.scale['100'].$value,
          },
        },
        round: {
          border: {
            radius: primitiveTokens.scale['400'].$value,
          },
        },
        rectangular: {
          border: {
            radius: primitiveTokens.scale['0'].$value,
          },
        },
      },

      // Hues
      hue: {
        bold: {
          bg: cachedResolveOsToken(colorTokens.bg.neutral.bold.default, tokenMap),
          color: cachedResolveOsToken(colorTokens.bg.surface.default, tokenMap),

          // Any of the semantic colors like primary, secondary, etc.
          semantic: {
            color: currentColor('contrast'),
            bg: currentColor('base'), // ADD THIS TO THE COMPONENT SCSS
          },
        },

        subtle: {
          bg: cachedResolveOsToken(lightTokens.primitives.neutral['100'], tokenMap),
          color: lightTokens.primitives.neutral['800'].$value,

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
              bold: cachedResolveOsToken(colorTokens.text.default, tokenMap),
              subtle: cachedResolveOsToken(lightTokens.primitives.neutral['300'], tokenMap),
            },

            width: primitiveTokens.scale['025'].$value,
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
        size: primitiveTokens.font['font-size']['400'].$value,
      },
    },
  },
};
