import { rgba, currentColor, ionColor, clamp, mix, dynamicFont } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import { colors as baseColors } from '../base/shared.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { highContrastDarkTheme } from './high-contrast-dark.tokens';
import { highContrastTheme } from './high-contrast.tokens';
import { lightTheme } from './light.tokens';
import { global, components } from './shared.tokens';

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'ios',

  palette: {
    light: lightTheme,
    dark: darkTheme,
    highContrast: highContrastTheme,
    highContrastDark: highContrastDarkTheme,
  },

  config: {
    components: {
      IonChip: {
        fill: 'solid',
        hue: 'bold',
        shape: 'soft',
        size: 'large',
      },

      IonProgressBar: {
        shape: 'round',
      },

      IonSpinner: {
        size: 'medium',
      },
    },
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
      margin: {
        top: 'var(--ion-spacing-xxs)',
        end: 'var(--ion-spacing-xxs)',
        bottom: 'var(--ion-spacing-xxs)',
        start: 'var(--ion-spacing-xxs)',
      },

      padding: {
        top: 'var(--ion-spacing-xs)',
        end: 'var(--ion-spacing-md)',
        bottom: 'var(--ion-spacing-xs)',
        start: 'var(--ion-spacing-md)',
      },

      // Sizes
      size: {
        small: {
          minHeight: 'var(--ion-scaling-xs)',

          font: {
            size: clamp(
              'var(--ion-font-size-xs)',
              `${((components.chip.font.size - 2) / global.root).toFixed(2)}rem`,
              'var(--ion-font-size-xl)'
            ),
          },
        },

        large: {
          minHeight: 'var(--ion-scaling-md)',

          font: {
            size: clamp('13px', `${(components.chip.font.size / global.root).toFixed(2)}rem`, '22px'),
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
          solid: {
            // Default non-semantic states
            default: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.87),
            },

            hover: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.16),
            },

            focus: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.16),
            },

            activated: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.2),
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', 0.08),
                color: currentColor('shade'),
              },

              hover: {
                background: currentColor('base', 0.12),
              },

              focus: {
                background: currentColor('base', 0.12),
              },

              activated: {
                background: currentColor('base', 0.16),
              },
            },
          },

          outline: {
            // Default non-semantic states
            default: {
              background: 'transparent',
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.87),

              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.32),
                style: 'solid',
                width: 'var(--ion-border-width-xxs)',
              },
            },

            hover: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            focus: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            activated: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.08),
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('shade'),

                border: {
                  color: currentColor('base', 0.32),
                  style: 'solid',
                  width: 'var(--ion-border-width-xxs)',
                },
              },

              hover: {
                background: currentColor('base', 0.12),
              },

              focus: {
                background: currentColor('base', 0.12),
              },

              activated: {
                background: currentColor('base', 0.16),
              },
            },
          },
        },

        subtle: {
          solid: {
            // Default non-semantic states
            default: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.05),
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.8),
            },

            hover: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.1),
            },

            focus: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.1),
            },

            activated: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.14),
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', null, true),
                color: currentColor('contrast', null, true),
              },

              hover: {
                background: currentColor('base', 0.6, true),
              },

              focus: {
                background: currentColor('base', 0.6, true),
              },

              activated: {
                background: currentColor('base', 0.8, true),
              },
            },
          },

          outline: {
            // Default non-semantic states
            default: {
              background: 'transparent',
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.8),

              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.16),
                style: 'solid',
                width: 'var(--ion-border-width-xxs)',
              },
            },

            hover: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            focus: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            activated: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('contrast', null, true),

                border: {
                  color: currentColor('base', 0.12),
                  style: 'solid',
                  width: 'var(--ion-border-width-xxs)',
                },
              },

              hover: {
                background: currentColor('base', 0.6, true),
              },

              focus: {
                background: currentColor('base', 0.6, true),
              },

              activated: {
                background: currentColor('base', 0.8, true),
              },
            },
          },
        },
      },

      icon: {
        color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.54),

        font: {
          size: `${(20 / components.chip.font.size).toFixed(2)}em`,
        },

        leading: {
          margin: {
            top: '-4px',
            end: 'var(--ion-spacing-sm)',
            bottom: '-4px',
            start: '-4px',
          },
        },

        trailing: {
          margin: {
            top: '-4px',
            end: '-4px',
            bottom: '-4px',
            start: 'var(--ion-spacing-sm)',
          },
        },
      },

      avatar: {
        height: `${(24 / components.chip.font.size).toFixed(2)}em`,
        width: `${(24 / components.chip.font.size).toFixed(2)}em`,

        leading: {
          margin: {
            top: '-4px',
            end: 'var(--ion-spacing-sm)',
            bottom: '-4px',
            start: '-8px',
          },
        },

        trailing: {
          margin: {
            top: '-4px',
            end: '-8px',
            bottom: '-4px',
            start: 'var(--ion-spacing-sm)',
          },
        },
      },
    },

    IonItemDivider: {
      background: `var(--ion-background-color-step-100, ${mix(baseColors.black, baseColors.white, '90%')})`,
      color: `var(--ion-text-color-step-150, ${mix(baseColors.white, baseColors.black, '85%')})`,
      minHeight: 'var(--ion-scaling-sm)',

      padding: {
        top: 'var(--ion-spacing-0)',
        end: 'var(--ion-spacing-0)',
        bottom: 'var(--ion-spacing-0)',
        start: components.item.padding.start,
      },

      inner: {
        padding: {
          top: 'var(--ion-spacing-0)',
          end: `calc(${components.item.padding.end} * 0.5)`,
          bottom: 'var(--ion-spacing-0)',
          start: 'var(--ion-spacing-0)',
        },
      },

      font: {
        size: dynamicFont(global.root, 17),
        weight: 'var(--ion-font-weight-semi-bold)',
      },

      icon: {
        start: {
          slotted: {
            margin: {
              top: components.item.icon.slot.margin.top,
              bottom: components.item.icon.slot.margin.bottom,
            },
          },
        },

        end: {
          slotted: {
            margin: {
              top: components.item.icon.slot.margin.top,
              bottom: components.item.icon.slot.margin.bottom,
            },
          },
        },
      },

      paragraph: {
        color: components.item.paragraph.color,
        overflow: 'inherit',

        margin: {
          top: components.item.paragraph.margin.top,
          end: components.item.paragraph.margin.end,
          bottom: components.item.paragraph.margin.bottom,
          start: components.item.paragraph.margin.start,
        },

        font: {
          size: components.item.paragraph.font.size,
        },

        text: {
          overflow: 'inherit',
        },

        trailing: {
          margin: {
            bottom: 'var(--ion-spacing-0)',
          },
        },
      },
    },

    IonProgressBar: {
      height: 'var(--ion-scaling-100)',

      indeterminate: {
        progress: {
          default: {
            background: ionColor('primary', 'base'),
          },

          semantic: {
            default: {
              background: currentColor('base'),
            },
          },
        },

        buffer: {
          bar: {
            default: {
              background: ionColor('primary', 'base', { alpha: 0.3 }),
            },

            solid: {
              default: {
                background: `var(--ion-background-color-step-100, ${mix(baseColors.black, baseColors.white, '90%')})`,
              },
            },
          },
        },
      },

      determinate: {
        progress: {
          default: {
            background: ionColor('primary', 'base'),
          },

          semantic: {
            default: {
              background: currentColor('base'),
            },
          },
        },

        buffer: {
          bar: {
            default: {
              background: ionColor('primary', 'base', { alpha: 0.3 }),
            },

            solid: {
              default: {
                background: `var(--ion-background-color-step-100, ${mix(baseColors.black, baseColors.white, '90%')})`,
              },
            },
          },

          circles: {
            default: {
              background: ionColor('primary', 'base', { alpha: 0.3 }),
            },

            semantic: {
              default: {
                background: currentColor('base', 0.3),
              },
            },

            solid: {
              default: {
                background: `var(--ion-background-color-step-100, ${mix(baseColors.black, baseColors.white, '90%')})`,
              },
            },
          },
        },
      },

      shape: {
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
    },

    IonSpinner: {
      color: 'var(--ion-text-color, #000)',

      lines: {
        stroke: {
          width: '7px',
        },

        small: {
          stroke: {
            width: '7px',
          },
        },

        sharp: {
          stroke: {
            width: 'var(--ion-scaling-100)',
          },

          small: {
            stroke: {
              width: 'var(--ion-scaling-100)',
            },
          },
        },
      },

      circular: {
        stroke: {
          width: '5.6',
        },
      },

      crescent: {
        stroke: {
          width: 'var(--ion-scaling-100)',
        },
      },

      dots: {
        stroke: {
          width: 'var(--ion-scaling-0)',
        },
      },

      // Sizes
      size: {
        xsmall: {
          width: 'var(--ion-scaling-400)',
          height: 'var(--ion-scaling-400)',
        },

        small: {
          width: 'var(--ion-scaling-xxs)',
          height: 'var(--ion-scaling-xxs)',
        },

        medium: {
          width: 'var(--ion-scaling-sm)',
          height: 'var(--ion-scaling-sm)',
        },

        large: {
          width: 'var(--ion-scaling-lg)',
          height: 'var(--ion-scaling-lg)',
        },

        xlarge: {
          width: 'var(--ion-scaling-xxxl)',
          height: 'var(--ion-scaling-xxxl)',
        },
      },
    },
  },
};
