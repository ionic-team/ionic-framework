import { rgba, currentColor, mix, dynamicFont, dynamicFontClamp, ionColor, overlay } from '../../utils/theme';
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
      IonBadge: {
        hue: 'bold',
        shape: 'round',
        size: 'medium',
      },

      IonButton: {
        fill: 'solid',
        hue: 'bold',
        shape: 'soft',
        size: 'medium',
      },

      IonChip: {
        fill: 'solid',
        hue: 'bold',
        shape: 'round',
        size: 'large',
      },

      IonNote: {
        hue: 'bold',
      },

      IonProgressBar: {
        shape: 'rectangular',
      },

      IonRouterLink: {
        hue: 'bold',
      },

      IonSpinner: {
        size: 'medium',
      },

      IonText: {
        hue: 'bold',
      },

      IonTitle: {
        hue: 'bold',
        size: 'medium',
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
    IonBackdrop: {
      background: baseColors.black,
    },

    IonBadge: {
      font: {
        family: 'var(--ion-font-family)',
      },

      // Hues
      hue: {
        bold: {
          default: {
            background: ionColor('primary', 'base'),
            color: ionColor('primary', 'contrast'),
          },

          semantic: {
            default: {
              background: currentColor('base'),
              color: currentColor('contrast'),
            },
          },
        },

        subtle: {
          default: {
            background: ionColor('primary', 'base', { subtle: true }),
            color: ionColor('primary', 'contrast', { subtle: true }),
          },

          semantic: {
            default: {
              background: currentColor('base', { subtle: true }),
              color: currentColor('contrast', { subtle: true }),
            },
          },
        },
      },

      // Shapes
      shape: {
        crisp: {
          border: {
            radius: 'var(--ion-radii-xxs)',
          },
        },

        soft: {
          border: {
            radius: 'var(--ion-radii-sm)',
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

      // Sizes
      size: {
        small: {
          content: {
            letterSpacing: '0.5px',

            min: {
              height: 'var(--ion-scaling-xxxs)',
              width: 'var(--ion-scaling-xxxs)',
            },

            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-xxs)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-xxs)',
            },

            font: {
              size: dynamicFont(global.root, 11),
              weight: 'var(--ion-font-weight-medium)',
            },

            line: {
              height: 'var(--ion-line-height-xxs)',
            },
          },

          dot: {
            height: 'var(--ion-scaling-150)',

            min: {
              width: 'var(--ion-scaling-150)',
            },

            padding: {
              top: 'var(--ion-spacing-xxxs)',
              end: 'var(--ion-spacing-xxxs)',
              bottom: 'var(--ion-spacing-xxxs)',
              start: 'var(--ion-spacing-xxxs)',
            },
          },
        },

        medium: {
          content: {
            letterSpacing: '0.5px',

            min: {
              height: 'var(--ion-scaling-xxs)',
              width: 'var(--ion-scaling-xxs)',
            },

            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-xs)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-xs)',
            },

            font: {
              size: dynamicFont(global.root, 13),
              weight: 'var(--ion-font-weight-medium)',
            },

            line: {
              height: 'var(--ion-line-height-xxs)',
            },
          },

          dot: {
            height: 'var(--ion-scaling-250)',

            min: {
              width: 'var(--ion-scaling-250)',
            },

            padding: {
              top: 'var(--ion-spacing-xxs)',
              end: 'var(--ion-spacing-xxs)',
              bottom: 'var(--ion-spacing-xxs)',
              start: 'var(--ion-spacing-xxs)',
            },
          },
        },

        large: {
          content: {
            letterSpacing: '0.5px',

            min: {
              height: 'var(--ion-scaling-xs)',
              width: 'var(--ion-scaling-xs)',
            },

            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-sm)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-sm)',
            },

            font: {
              size: dynamicFont(global.root, 15),
              weight: 'var(--ion-font-weight-medium)',
            },

            line: {
              height: 'var(--ion-line-height-xxs)',
            },
          },

          dot: {
            height: 'var(--ion-scaling-350)',

            min: {
              width: 'var(--ion-scaling-350)',
            },

            padding: {
              top: 'var(--ion-spacing-xxs)',
              end: 'var(--ion-spacing-xxs)',
              bottom: 'var(--ion-spacing-xxs)',
              start: 'var(--ion-spacing-xxs)',
            },
          },
        },
      },
    },

    IonButton: {
      margin: {
        top: 'var(--ion-spacing-xxs)',
        end: 'var(--ion-spacing-xxxs)',
        bottom: 'var(--ion-spacing-xxs)',
        start: 'var(--ion-spacing-xxxs)',
      },

      transition: 'box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), background-color 15ms linear, color 15ms linear',

      font: {
        family: 'var(--ion-font-family, inherit)',
      },

      letter: {
        spacing: '0.0893em',
      },

      text: {
        transform: 'uppercase',
      },

      // Hues
      hue: {
        bold: {
          solid: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-bold)',
              },
            },

            default: {
              background: ionColor('primary', 'base'),
              color: ionColor('primary', 'contrast'),

              box: {
                shadow:
                  '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              },

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: overlay(ionColor('primary', 'base'), ionColor('primary', 'contrast', { alpha: 0.24 })),
              color: ionColor('primary', 'contrast'),

              box: {
                shadow:
                  '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
              },
            },

            hover: {
              background: overlay(ionColor('primary', 'base'), ionColor('primary', 'contrast', { alpha: 0.08 })),
              color: ionColor('primary', 'contrast'),

              box: {
                shadow:
                  '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
              },
            },

            // The ripple shows the press, and the button lifts
            activated: {
              box: {
                shadow:
                  '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
              },
            },

            disabled: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),

              box: {
                shadow: 'none',
              },

              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
            },

            rippleEffect: {
              opacity: '0.24',
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base'),
                color: currentColor('contrast'),
              },

              focus: {
                background: overlay(currentColor('base'), currentColor('contrast', { alpha: 0.24 })),
                color: currentColor('contrast'),
              },

              hover: {
                background: overlay(currentColor('base'), currentColor('contrast', { alpha: 0.08 })),
                color: currentColor('contrast'),
              },

              disabled: {
                background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
              },

              rippleEffect: {
                opacity: '0.24',
              },
            },
          },

          outline: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-bold)',
              },
            },

            default: {
              background: 'transparent',
              color: ionColor('primary', 'foreground'),

              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                style: 'solid',
                width: 'var(--ion-border-width-xxxs)',
              },

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: ionColor('primary', 'base', { alpha: 0.12 }),
              color: ionColor('primary', 'foreground'),
            },

            hover: {
              background: ionColor('primary', 'base', { alpha: 0.04 }),
              color: ionColor('primary', 'foreground'),
            },

            disabled: {
              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
              },

              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
            },

            rippleEffect: {
              opacity: '0.12',
            },

            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('foreground'),

                border: {
                  color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                },
              },

              focus: {
                background: currentColor('base', { alpha: 0.12 }),
                color: currentColor('foreground'),
              },

              hover: {
                background: currentColor('base', { alpha: 0.04 }),
                color: currentColor('foreground'),
              },

              disabled: {
                border: {
                  color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                },

                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
              },

              rippleEffect: {
                opacity: '0.12',
              },
            },
          },

          clear: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-bold)',
              },
            },

            default: {
              background: 'transparent',
              color: ionColor('primary', 'foreground'),

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: ionColor('primary', 'base', { alpha: 0.12 }),
              color: ionColor('primary', 'foreground'),
            },

            hover: {
              background: ionColor('primary', 'base', { alpha: 0.04 }),
              color: ionColor('primary', 'foreground'),
            },

            disabled: {
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
            },

            rippleEffect: {
              opacity: '0.12',
            },

            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('foreground'),
              },

              focus: {
                background: currentColor('base', { alpha: 0.12 }),
                color: currentColor('foreground'),
              },

              hover: {
                background: currentColor('base', { alpha: 0.04 }),
                color: currentColor('foreground'),
              },

              disabled: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
              },

              rippleEffect: {
                opacity: '0.12',
              },
            },
          },
        },

        subtle: {
          solid: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-bold)',
              },
            },

            default: {
              background: ionColor('primary', 'base', { subtle: true }),
              color: ionColor('primary', 'contrast', { subtle: true }),
              box: {
                shadow:
                  '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              },

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: overlay(
                ionColor('primary', 'base', { subtle: true }),
                ionColor('primary', 'contrast', { alpha: 0.24, subtle: true })
              ),
              color: ionColor('primary', 'contrast', { subtle: true }),

              box: {
                shadow:
                  '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
              },
            },

            hover: {
              background: overlay(
                ionColor('primary', 'base', { subtle: true }),
                ionColor('primary', 'contrast', { alpha: 0.08, subtle: true })
              ),

              color: ionColor('primary', 'contrast', { subtle: true }),

              box: {
                shadow:
                  '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
              },
            },

            // The ripple shows the press, and the button lifts
            activated: {
              box: {
                shadow:
                  '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
              },
            },

            disabled: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),

              box: {
                shadow: 'none',
              },

              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
            },

            rippleEffect: {
              opacity: '0.24',
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', { subtle: true }),
                color: currentColor('contrast', { subtle: true }),
              },

              focus: {
                background: overlay(
                  currentColor('base', { subtle: true }),
                  currentColor('contrast', { alpha: 0.24, subtle: true })
                ),
                color: currentColor('contrast', { subtle: true }),
              },

              hover: {
                background: overlay(
                  currentColor('base', { subtle: true }),
                  currentColor('contrast', { alpha: 0.08, subtle: true })
                ),
                color: currentColor('contrast', { subtle: true }),
              },

              disabled: {
                background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
              },

              rippleEffect: {
                opacity: '0.24',
              },
            },
          },

          outline: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-bold)',
              },
            },

            default: {
              background: 'transparent',
              color: ionColor('primary', 'foreground', { subtle: true }),

              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                style: 'solid',
                width: 'var(--ion-border-width-xxxs)',
              },

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: ionColor('primary', 'base', { alpha: 0.12 }),
              color: ionColor('primary', 'foreground', { subtle: true }),
            },

            hover: {
              background: ionColor('primary', 'base', { alpha: 0.04 }),
              color: ionColor('primary', 'foreground', { subtle: true }),
            },

            disabled: {
              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
              },

              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
            },

            rippleEffect: {
              opacity: '0.12',
            },

            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('foreground', { subtle: true }),

                border: {
                  color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                },
              },

              focus: {
                background: currentColor('base', { alpha: 0.12 }),
                color: currentColor('foreground', { subtle: true }),
              },

              hover: {
                background: currentColor('base', { alpha: 0.04 }),
                color: currentColor('foreground', { subtle: true }),
              },

              disabled: {
                border: {
                  color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                },

                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
              },

              rippleEffect: {
                opacity: '0.12',
              },
            },
          },

          clear: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-bold)',
              },
            },

            default: {
              background: 'transparent',
              color: ionColor('primary', 'foreground', { subtle: true }),

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: ionColor('primary', 'base', { alpha: 0.12 }),
              color: ionColor('primary', 'foreground', { subtle: true }),
            },

            hover: {
              background: ionColor('primary', 'base', { alpha: 0.04 }),
              color: ionColor('primary', 'foreground', { subtle: true }),
            },

            disabled: {
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
            },

            rippleEffect: {
              opacity: '0.12',
            },

            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('foreground', { subtle: true }),
              },

              focus: {
                background: currentColor('base', { alpha: 0.12 }),
                color: currentColor('foreground', { subtle: true }),
              },

              hover: {
                background: currentColor('base', { alpha: 0.04 }),
                color: currentColor('foreground', { subtle: true }),
              },

              disabled: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.38),
              },

              rippleEffect: {
                opacity: '0.12',
              },
            },
          },
        },
      },

      // Sizes
      size: {
        small: {
          min: {
            height: '2.1em',
          },

          padding: {
            top: 'var(--ion-spacing-xxs)',
            end: '0.9em',
            bottom: 'var(--ion-spacing-xxs)',
            start: '0.9em',
          },

          // MD2 text buttons have half the padding of contained buttons
          clear: {
            padding: {
              end: '0.45em',
              start: '0.45em',
            },
          },

          // MD2 outlined buttons count the border as part of the padding
          outline: {
            padding: {
              end: 'calc(0.9em - var(--ion-border-width-xxxs))',
              start: 'calc(0.9em - var(--ion-border-width-xxxs))',
            },
          },

          font: {
            size: dynamicFont(global.root, 13),
          },

          icon: {
            font: {
              size: '1.2857em',
            },

            // The negative margin moves the icon closer to the edge than a label would be
            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: '0.4444em',
                bottom: 'var(--ion-spacing-0)',
                start: '-0.2222em',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: '-0.2222em',
                bottom: 'var(--ion-spacing-0)',
                start: '0.4444em',
              },
            },
          },

          // MD does not specify a small size, so these are based on the iOS small size
          iconOnly: {
            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-0)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-0)',
            },

            icon: {
              font: {
                size: dynamicFontClamp(global.root, 0.66, 19.7, 2.05, 'em'),
              },
            },
          },

          spinner: {
            // `medium`, the default, matches the icon; the other sizes keep their standalone ratio to it
            size: {
              xsmall: {
                height: '0.7347em',
                width: '0.7347em',
              },

              small: {
                height: '0.9184em',
                width: '0.9184em',
              },

              medium: {
                height: '1.2857em',
                width: '1.2857em',
              },

              large: {
                height: '1.6531em',
                width: '1.6531em',
              },

              xlarge: {
                height: '2.2041em',
                width: '2.2041em',
              },
            },
          },

          badge: {
            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-sm)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-0)',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-0)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-sm)',
              },
            },
          },
        },

        medium: {
          min: {
            height: 'var(--ion-scaling-900)',
            width: 'var(--ion-scaling-xxxxl)',
          },

          padding: {
            top: 'var(--ion-spacing-sm)',
            end: '1.1429em',
            bottom: 'var(--ion-spacing-sm)',
            start: '1.1429em',
          },

          // MD2 text buttons have half the padding of contained buttons
          clear: {
            padding: {
              end: '0.5714em',
              start: '0.5714em',
            },
          },

          // MD2 outlined buttons count the border as part of the padding
          outline: {
            padding: {
              end: 'calc(1.1429em - var(--ion-border-width-xxxs))',
              start: 'calc(1.1429em - var(--ion-border-width-xxxs))',
            },
          },

          font: {
            size: dynamicFont(global.root, 14),
          },

          icon: {
            font: {
              size: '1.2857em',
            },

            // The negative margin moves the icon closer to the edge than a label would be
            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: '0.4444em',
                bottom: 'var(--ion-spacing-0)',
                start: '-0.2222em',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: '-0.2222em',
                bottom: 'var(--ion-spacing-0)',
                start: '0.4444em',
              },
            },
          },

          iconOnly: {
            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-0)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-0)',
            },

            icon: {
              font: {
                /**
                 * The values were provided through MD design.
                 * min font size: 15px, default font size: 22.4px, max font size: 43px
                 */
                size: dynamicFontClamp(global.root, 0.59, 25.6, 1.68, 'em'),
              },
            },
          },

          spinner: {
            // `medium`, the default, matches the icon; the other sizes keep their standalone ratio to it
            size: {
              xsmall: {
                height: '0.7347em',
                width: '0.7347em',
              },

              small: {
                height: '0.9184em',
                width: '0.9184em',
              },

              medium: {
                height: '1.2857em',
                width: '1.2857em',
              },

              large: {
                height: '1.6531em',
                width: '1.6531em',
              },

              xlarge: {
                height: '2.2041em',
                width: '2.2041em',
              },
            },
          },

          badge: {
            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-sm)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-0)',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-0)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-sm)',
              },
            },
          },
        },

        large: {
          min: {
            height: '2.8em',
          },

          padding: {
            top: 'var(--ion-spacing-350)',
            end: '1em',
            bottom: 'var(--ion-spacing-350)',
            start: '1em',
          },

          // MD2 text buttons have half the padding of contained buttons
          clear: {
            padding: {
              end: '0.5em',
              start: '0.5em',
            },
          },

          // MD2 outlined buttons count the border as part of the padding
          outline: {
            padding: {
              end: 'calc(1em - var(--ion-border-width-xxxs))',
              start: 'calc(1em - var(--ion-border-width-xxxs))',
            },
          },

          font: {
            size: dynamicFont(global.root, 20),
          },

          icon: {
            font: {
              size: '1.2857em',
            },

            // The negative margin moves the icon closer to the edge than a label would be
            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: '0.4444em',
                bottom: 'var(--ion-spacing-0)',
                start: '-0.2222em',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: '-0.2222em',
                bottom: 'var(--ion-spacing-0)',
                start: '0.4444em',
              },
            },
          },

          // MD does not specify a large size, so these are based on the iOS large size
          iconOnly: {
            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-0)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-0)',
            },

            icon: {
              font: {
                size: dynamicFontClamp(global.root, 0.67, 22.4, 1.92, 'em'),
              },
            },
          },

          spinner: {
            // `medium`, the default, matches the icon; the other sizes keep their standalone ratio to it
            size: {
              xsmall: {
                height: '0.7347em',
                width: '0.7347em',
              },

              small: {
                height: '0.9184em',
                width: '0.9184em',
              },

              medium: {
                height: '1.2857em',
                width: '1.2857em',
              },

              large: {
                height: '1.6531em',
                width: '1.6531em',
              },

              xlarge: {
                height: '2.2041em',
                width: '2.2041em',
              },
            },
          },

          badge: {
            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-md)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-0)',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-0)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-md)',
              },
            },
          },
        },
      },

      // Shapes
      shape: {
        crisp: {
          border: {
            radius: 'var(--ion-radii-xxs)',
          },
        },

        soft: {
          border: {
            radius: 'var(--ion-radii-sm)',
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
    },

    // Parents that theme the buttons they contain
    IonButtons: {
      IonButton: {
        size: {
          medium: {
            // Buttons in `ion-buttons` fit their content, so an icon without `slot="icon-only"` doesn't widen them
            min: {
              width: 'auto',
            },
          },
        },
      },
    },

    IonDatetime: {
      IonButton: {
        margin: {
          top: 'var(--ion-spacing-0)',
          end: 'var(--ion-spacing-xxxs)',
          bottom: 'var(--ion-spacing-0)',
          start: 'var(--ion-spacing-xxxs)',
        },

        size: {
          medium: {
            min: {
              height: 'var(--ion-scaling-md)',
            },

            // Datetime's buttons are `clear` in md, so this replaces the `clear` padding
            clear: {
              padding: {
                top: 'var(--ion-spacing-75)',
                end: 'var(--ion-spacing-sm)',
                bottom: 'var(--ion-spacing-75)',
                start: 'var(--ion-spacing-sm)',
              },
            },
          },
        },

        hue: {
          bold: {
            solid: {
              default: {
                box: {
                  shadow: 'none',
                },
              },

              focus: {
                box: {
                  shadow: 'none',
                },
              },

              hover: {
                box: {
                  shadow: 'none',
                },
              },

              activated: {
                box: {
                  shadow: 'none',
                },
              },
            },

            // Datetime renders primary buttons, so their tints use primary
            clear: {
              focus: {
                background: ionColor('primary', 'base', { alpha: 0.12 }),
              },

              hover: {
                background: ionColor('primary', 'base', { alpha: 0.04 }),
              },
            },
          },
        },
      },
    },

    IonToolbar: {
      // In a toolbar, a disabled button keeps its colors and fades
      IonButton: {
        hue: {
          bold: {
            solid: {
              disabled: {
                background: 'var(--ion-button-hue-bold-solid-default-background)',

                box: {
                  shadow: 'var(--ion-button-hue-bold-solid-default-box-shadow)',
                },

                color: 'var(--ion-button-hue-bold-solid-default-color)',

                opacity: '0.5',
              },

              semantic: {
                disabled: {
                  background: 'var(--ion-button-hue-bold-solid-semantic-default-background)',
                  color: 'var(--ion-button-hue-bold-solid-semantic-default-color)',
                },
              },
            },

            outline: {
              disabled: {
                border: {
                  color: 'var(--ion-button-hue-bold-outline-default-border-color)',
                },

                color: 'var(--ion-button-hue-bold-outline-default-color)',

                opacity: '0.5',
              },

              semantic: {
                disabled: {
                  border: {
                    color: 'var(--ion-button-hue-bold-outline-semantic-default-border-color)',
                  },

                  color: 'var(--ion-button-hue-bold-outline-semantic-default-color)',
                },
              },
            },

            clear: {
              disabled: {
                color: 'var(--ion-button-hue-bold-clear-default-color)',

                opacity: '0.5',
              },

              semantic: {
                disabled: {
                  color: 'var(--ion-button-hue-bold-clear-semantic-default-color)',
                },
              },
            },
          },
        },
      },

      IonButtons: {
        IonButton: {
          shape: {
            soft: {
              border: {
                radius: 'var(--ion-radii-xxs)',
              },
            },

            rectangular: {
              border: {
                radius: 'var(--ion-radii-xxs)',
              },
            },
          },

          hue: {
            bold: {
              solid: {
                default: {
                  box: {
                    shadow: 'none',
                  },
                },

                focus: {
                  box: {
                    shadow: 'none',
                  },
                },

                hover: {
                  box: {
                    shadow: 'none',
                  },
                },

                activated: {
                  box: {
                    shadow: 'none',
                  },
                },
              },
            },
          },
        },
      },

      // In a toolbar without a color
      default: {
        IonButton: {
          hue: {
            bold: {
              solid: {
                default: {
                  background: `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                  color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
                },

                focus: {
                  background: overlay(
                    `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                    ionColor('primary', 'contrast', { alpha: 0.24 })
                  ),
                  color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
                },

                hover: {
                  background: overlay(
                    `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                    ionColor('primary', 'contrast', { alpha: 0.08 })
                  ),
                  color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
                },

                activated: {
                  color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
                },
              },

              outline: {
                default: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,

                  // MD2's border is the text color at 12%, like the focus tint
                  border: {
                    color: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.12)',
                  },
                },

                focus: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                },

                hover: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                },
              },

              clear: {
                default: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,
                },

                focus: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,
                },

                hover: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,
                },

                activated: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,
                },
              },
            },
          },
        },

        IonButtons: {
          IonButton: {
            hue: {
              bold: {
                // The solid fill inverts the toolbar colors
                solid: {
                  default: {
                    background: 'var(--ion-toolbar-color, var(--ion-text-color, #424242))',
                    color: 'var(--ion-toolbar-background, var(--ion-background-color, #fff))',
                  },

                  /**
                   * The tint is the button's text color, which matches the page background
                   * unless the app gives toolbars their own `--ion-toolbar-background`.
                   */
                  focus: {
                    background: overlay(
                      'var(--ion-toolbar-color, var(--ion-text-color, #424242))',
                      'rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.24)'
                    ),
                    color: 'var(--ion-toolbar-background, var(--ion-background-color, #fff))',
                  },

                  hover: {
                    background: overlay(
                      'var(--ion-toolbar-color, var(--ion-text-color, #424242))',
                      'rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.08)'
                    ),
                    color: 'var(--ion-toolbar-background, var(--ion-background-color, #fff))',
                  },

                  activated: {
                    background: 'var(--ion-toolbar-color, var(--ion-text-color, #424242))',
                    color: 'var(--ion-toolbar-background, var(--ion-background-color, #fff))',
                  },
                },

                // Outline and clear tints use `--ion-text-color`, since `--ion-toolbar-color` has no `-rgb` variable
                outline: {
                  default: {
                    background: 'transparent',
                    color: 'var(--ion-toolbar-color, currentColor)',

                    // MD2's border is the text color at 12%, like the focus tint
                    border: {
                      color: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.12)',
                    },
                  },

                  // A button with a `color` gets the same border as the others in the toolbar
                  semantic: {
                    default: {
                      border: {
                        color: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.12)',
                      },
                    },
                  },

                  focus: {
                    background: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.12)',
                    color: 'var(--ion-toolbar-color, currentColor)',
                  },

                  hover: {
                    background: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.04)',
                    color: 'var(--ion-toolbar-color, currentColor)',
                  },

                  activated: {
                    background: 'transparent',
                    color: 'currentColor',
                  },
                },

                clear: {
                  default: {
                    background: 'transparent',
                    color: 'var(--ion-toolbar-color, currentColor)',
                  },

                  focus: {
                    background: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.12)',
                    color: 'var(--ion-toolbar-color, currentColor)',
                  },

                  hover: {
                    background: 'rgba(var(--ion-text-color-rgb, 66, 66, 66), 0.04)',
                    color: 'var(--ion-toolbar-color, currentColor)',
                  },

                  activated: {
                    background: 'transparent',
                    color: 'var(--ion-toolbar-color, currentColor)',
                  },
                },
              },
            },
          },
        },
      },

      // In a toolbar with a color
      semantic: {
        IonButtons: {
          IonButton: {
            hue: {
              bold: {
                solid: {
                  default: {
                    background: currentColor('contrast'),
                    color: currentColor('base'),
                  },

                  // `shade` has no `-rgb` variable, so `base` stands in for it
                  focus: {
                    background: overlay(currentColor('contrast'), currentColor('base', { alpha: 0.24 })),
                    color: currentColor('base'),
                  },

                  hover: {
                    background: overlay(currentColor('contrast'), currentColor('base', { alpha: 0.08 })),
                    color: currentColor('base'),
                  },

                  activated: {
                    background: currentColor('contrast'),
                    color: currentColor('base'),
                  },
                },

                /**
                 * MD2's border is the text color at 12%. A button with its own `color` keeps the
                 * standalone border, since its color class replaces `--ion-color-contrast-rgb`.
                 */
                outline: {
                  default: {
                    background: 'transparent',
                    color: 'currentColor',

                    border: {
                      color: currentColor('contrast', { alpha: 0.12 }),
                    },
                  },

                  focus: {
                    background: currentColor('contrast', { alpha: 0.12 }),
                    color: currentColor('contrast'),
                  },

                  hover: {
                    background: currentColor('contrast', { alpha: 0.04 }),
                    color: currentColor('contrast'),
                  },

                  activated: {
                    background: 'transparent',
                    color: 'currentColor',
                  },
                },

                clear: {
                  default: {
                    background: 'transparent',
                    color: 'currentColor',
                  },

                  focus: {
                    background: currentColor('contrast', { alpha: 0.12 }),
                    color: currentColor('contrast'),
                  },

                  hover: {
                    background: currentColor('contrast', { alpha: 0.04 }),
                    color: currentColor('contrast'),
                  },

                  activated: {
                    background: 'transparent',
                    color: 'currentColor',
                  },
                },
              },

              // Subtle text uses `foreground`, which can't be read on the toolbar's color, so outline and clear match bold
              subtle: {
                outline: {
                  default: {
                    background: 'transparent',
                    color: 'currentColor',

                    border: {
                      color: currentColor('contrast', { alpha: 0.12 }),
                    },
                  },

                  focus: {
                    background: currentColor('contrast', { alpha: 0.12 }),
                    color: currentColor('contrast'),
                  },

                  hover: {
                    background: currentColor('contrast', { alpha: 0.04 }),
                    color: currentColor('contrast'),
                  },

                  activated: {
                    background: 'transparent',
                    color: 'currentColor',
                  },
                },

                clear: {
                  default: {
                    background: 'transparent',
                    color: 'currentColor',
                  },

                  focus: {
                    background: currentColor('contrast', { alpha: 0.12 }),
                    color: currentColor('contrast'),
                  },

                  hover: {
                    background: currentColor('contrast', { alpha: 0.04 }),
                    color: currentColor('contrast'),
                  },

                  activated: {
                    background: 'transparent',
                    color: 'currentColor',
                  },
                },
              },
            },
          },
        },
      },
    },

    IonChip: {
      margin: {
        top: 'var(--ion-spacing-xxs)',
        end: 'var(--ion-spacing-xxs)',
        bottom: 'var(--ion-spacing-xxs)',
        start: 'var(--ion-spacing-xxs)',
      },

      // Sizes
      size: {
        // MD2 has no small chip, so this scales the `large` chip down
        // to 24px on the 4dp grid
        small: {
          padding: {
            top: 'var(--ion-spacing-xxs)',
            end: 'var(--ion-spacing-sm)',
            bottom: 'var(--ion-spacing-xxs)',
            start: 'var(--ion-spacing-sm)',
          },

          letterSpacing: '0.0179em',

          min: {
            height: 'var(--ion-scaling-xs)',
          },

          font: {
            size: `${(components.chip.font.size - 2) / global.root}rem`,
          },

          line: {
            height: `${16 / (components.chip.font.size - 2)}`,
          },

          icon: {
            font: {
              size: `${20 / components.chip.font.size}em`,
            },
          },

          avatar: {
            leading: {
              margin: {
                top: '-4px',
                end: 'var(--ion-spacing-sm)',
                bottom: '-4px',
                start: '-6px',
              },
            },

            trailing: {
              margin: {
                top: '-4px',
                end: '-6px',
                bottom: '-4px',
                start: 'var(--ion-spacing-sm)',
              },
            },
          },
        },

        large: {
          padding: {
            top: 'var(--ion-spacing-xs)',
            end: 'var(--ion-spacing-md)',
            bottom: 'var(--ion-spacing-xs)',
            start: 'var(--ion-spacing-md)',
          },

          letterSpacing: '0.0179em',

          min: {
            height: 'var(--ion-scaling-md)',
          },

          font: {
            size: `${components.chip.font.size / global.root}rem`,
          },

          line: {
            height: `${20 / components.chip.font.size}`,
          },

          icon: {
            font: {
              size: `${20 / components.chip.font.size}em`,
            },
          },

          avatar: {
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
      },

      // States
      state: {
        disabled: {
          opacity: '0.38',
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
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.21),
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', { alpha: 0.08 }),
                color: currentColor('shade'),
              },

              hover: {
                background: currentColor('base', { alpha: 0.12 }),
              },

              focus: {
                background: currentColor('base', { alpha: 0.12 }),
              },
            },
          },

          outline: {
            // Default non-semantic states
            default: {
              background: 'transparent',
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.87),

              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                style: 'solid',
                width: 'var(--ion-border-width-xxxs)',
              },
            },

            hover: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            focus: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.1),
            },

            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('shade'),

                border: {
                  color: currentColor('base', { alpha: 0.32 }),
                  style: 'solid',
                  width: 'var(--ion-border-width-xxxs)',
                },
              },

              hover: {
                background: currentColor('base', { alpha: 0.12 }),
              },

              focus: {
                background: currentColor('base', { alpha: 0.12 }),
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

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', { subtle: true }),
                color: currentColor('contrast', { subtle: true }),
              },

              hover: {
                background: currentColor('base', { alpha: 0.6, subtle: true }),
              },

              focus: {
                background: currentColor('base', { alpha: 0.6, subtle: true }),
              },
            },
          },

          outline: {
            // Default non-semantic states
            default: {
              background: 'transparent',
              color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.8),

              border: {
                color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.12),
                style: 'solid',
                width: 'var(--ion-border-width-xxxs)',
              },
            },

            hover: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            focus: {
              background: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.04),
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('contrast', { subtle: true }),

                border: {
                  color: currentColor('base', { alpha: 0.12 }),
                  style: 'solid',
                  width: 'var(--ion-border-width-xxxs)',
                },
              },

              hover: {
                background: currentColor('base', { alpha: 0.6, subtle: true }),
              },

              focus: {
                background: currentColor('base', { alpha: 0.6, subtle: true }),
              },
            },
          },
        },
      },

      icon: {
        color: rgba('var(--ion-text-color-rgb, 0, 0, 0)', 0.54),

        leading: {
          margin: {
            top: '-4px',
            end: 'var(--ion-spacing-xxs)',
            bottom: '-4px',
            start: '-4px',
          },
        },

        trailing: {
          margin: {
            top: '-4px',
            end: '-4px',
            bottom: '-4px',
            start: 'var(--ion-spacing-xxs)',
          },
        },
      },

      avatar: {
        height: `${24 / components.chip.font.size}em`,
        width: `${24 / components.chip.font.size}em`,
      },
    },

    IonCol: {
      breakpoint: {
        xs: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },
        },

        sm: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },
        },

        md: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },
        },

        lg: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },
        },

        xl: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },
        },

        xxl: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },
        },
      },
    },

    IonContent: {
      default: {
        background: baseColors.backgroundColor,
      },

      semantic: {
        default: {
          background: currentColor('base'),
          color: currentColor('contrast'),
        },
      },

      font: {
        family: 'var(--ion-font-family)',
      },

      overflow: 'auto',

      padding: {
        bottom: 'var(--ion-spacing-0)',
        end: 'var(--ion-spacing-0)',
        start: 'var(--ion-spacing-0)',
        top: 'var(--ion-spacing-0)',
      },
    },

    IonGallery: {
      gap: 'var(--ion-spacing-lg)',
    },

    IonGrid: {
      breakpoint: {
        xs: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },

          width: '100%',
        },

        sm: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },

          width: '540px',
        },

        md: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },

          width: '720px',
        },

        lg: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },

          width: '960px',
        },

        xl: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },

          width: '1140px',
        },

        xxl: {
          padding: {
            bottom: '5px',
            end: '5px',
            start: '5px',
            top: '5px',
          },

          width: '1320px',
        },
      },

      columns: 12,
    },

    IonItemDivider: {
      background: baseColors.backgroundColor,
      color: `var(--ion-text-color-step-600, ${mix(baseColors.white, baseColors.black, '40%')})`,
      min: {
        height: 'var(--ion-scaling-750)',
      },

      padding: {
        top: 'var(--ion-spacing-0)',
        end: 'var(--ion-spacing-0)',
        bottom: 'var(--ion-spacing-0)',
        start: components.item.padding.start,
      },

      inner: {
        padding: {
          top: 'var(--ion-spacing-0)',
          end: components.item.inner.padding.end,
          bottom: 'var(--ion-spacing-0)',
          start: 'var(--ion-spacing-0)',
        },
      },

      border: {
        bottom: `1px solid ${components.item.border.color}`,
      },

      font: {
        size: dynamicFont(global.root, components.itemDivider.font.size),
      },

      start: {
        slotted: {
          margin: {
            end: components.item.slot.child.start.margin.end,
          },
        },
      },

      end: {
        slotted: {
          margin: {
            start: components.item.slot.child.end.margin.start,
          },
        },
      },

      label: {
        margin: {
          top: '13px',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-250)',
          start: 'var(--ion-spacing-0)',
        },
      },

      icon: {
        font: {
          /**
           * The icon's font size should use em units to support
           * font scaling but evaluate to 24px at 100% font size.
           * The value in em units is calculated by dividing
           * the icon's font size in pixels by the item divider's
           * font size in pixels.
           * e.g. 24px / 14px = 1.7142857143em
           */
          size: `${components.item.icon.slot.font.size / components.itemDivider.font.size}em`,
        },

        start: {
          slotted: {
            margin: {
              top: components.item.icon.slot.margin.top,
              end: components.item.icon.start.slot.margin.end,
              bottom: components.item.icon.slot.margin.bottom,
            },
          },
        },

        end: {
          slotted: {
            margin: {
              top: components.item.icon.slot.margin.top,
              start: components.item.icon.end.slot.margin.start,
              bottom: components.item.icon.slot.margin.bottom,
            },
          },
        },

        default: {
          color: components.item.icon.slot.color,
        },

        semantic: {
          default: {
            color: currentColor('contrast'),
          },
        },
      },

      note: {
        align: {
          self: 'flex-start',
        },

        padding: {
          top: components.item.note.slot.padding.top,
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-0)',
          start: 'var(--ion-spacing-0)',
        },
      },

      avatar: {
        height: components.item.avatar.height,
        width: components.item.avatar.width,

        margin: {
          top: components.item.media.slot.margin.top,
          bottom: components.item.media.slot.margin.bottom,
        },

        start: {
          slotted: {
            margin: {
              end: components.item.media.start.slot.margin.end,
            },
          },
        },

        end: {
          slotted: {
            margin: {
              start: components.item.media.end.slot.margin.start,
            },
          },
        },
      },

      thumbnail: {
        height: components.item.thumbnail.height,
        width: components.item.thumbnail.width,

        margin: {
          top: components.item.media.slot.margin.top,
          bottom: components.item.media.slot.margin.bottom,
        },

        start: {
          slotted: {
            margin: {
              end: components.item.media.start.slot.margin.end,
            },
          },
        },

        end: {
          slotted: {
            margin: {
              start: components.item.media.end.slot.margin.start,
            },
          },
        },
      },

      paragraph: {
        color: components.item.paragraph.color,
        overflow: 'inherit',

        margin: {
          top: 'var(--ion-spacing-0)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },

        font: {
          size: dynamicFont(global.root, 14),
        },

        text: {
          overflow: 'initial',
        },
      },
    },

    IonNote: {
      font: {
        family: 'var(--ion-font-family)',
        size: dynamicFont(global.root, 12),
      },

      hue: {
        bold: {
          default: {
            color: `var(--ion-text-color-step-400, ${mix(baseColors.white, baseColors.black, '60%')})`,
          },

          semantic: {
            default: {
              color: currentColor('foreground'),
            },
          },
        },

        subtle: {
          default: {
            color: `var(--ion-text-color-step-400, ${mix(baseColors.white, baseColors.black, '60%')})`,
          },

          semantic: {
            default: {
              color: currentColor('foreground', { subtle: true }),
            },
          },
        },
      },

      letterSpacing: '0.0333em',

      line: {
        height: dynamicFont(global.root, 16),
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

            semantic: {
              default: {
                background: currentColor('base', { alpha: 0.3 }),
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

            semantic: {
              default: {
                background: currentColor('base', { alpha: 0.3 }),
              },
            },
          },

          circles: {
            default: {
              background: ionColor('primary', 'base', { alpha: 0.3 }),
            },

            semantic: {
              default: {
                background: currentColor('base', { alpha: 0.3 }),
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

    IonRippleEffect: {
      opacity: '0.16',
    },

    IonRouterLink: {
      hue: {
        bold: {
          default: {
            color: ionColor('primary', 'foreground'),
          },

          focus: {
            background: ionColor('primary', 'base', { alpha: 0.12 }),
          },

          semantic: {
            default: {
              color: currentColor('foreground'),
            },

            focus: {
              background: currentColor('base', { alpha: 0.12 }),
            },
          },
        },

        subtle: {
          default: {
            color: ionColor('primary', 'foreground', { subtle: true }),
          },

          focus: {
            background: ionColor('primary', 'base', { alpha: 0.12 }),
          },

          semantic: {
            default: {
              color: currentColor('foreground', { subtle: true }),
            },

            focus: {
              background: currentColor('base', { alpha: 0.12 }),
            },
          },
        },
      },

      state: {
        focus: {
          border: {
            radius: 'var(--ion-radii-sm)',
          },

          padding: {
            top: 'var(--ion-spacing-xxxs)',
            end: 'var(--ion-spacing-xxs)',
            bottom: 'var(--ion-spacing-xxxs)',
            start: 'var(--ion-spacing-xxs)',
          },
        },
      },
    },

    IonRow: {
      gap: 'var(--ion-spacing-0)',
    },

    IonSkeletonText: {
      animated: {
        background: {
          alpha: 0.135,
          rgb: baseColors.textColorRgb,
        },
      },

      default: {
        background: {
          alpha: 0.065,
          rgb: baseColors.textColorRgb,
        },
      },

      line: {
        height: 'var(--ion-scaling-250)',
      },

      margin: {
        bottom: 'var(--ion-spacing-xxs)',
        top: 'var(--ion-spacing-xxs)',
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
          width: 'var(--ion-scaling-xxxs)',
          height: 'var(--ion-scaling-xxxs)',
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

    IonText: {
      hue: {
        bold: {
          semantic: {
            default: {
              color: currentColor('foreground'),
            },
          },
        },

        subtle: {
          semantic: {
            default: {
              color: currentColor('foreground', { subtle: true }),
            },
          },
        },
      },
    },

    IonThumbnail: {
      height: 'var(--ion-scaling-xxxl)',
      width: 'var(--ion-scaling-xxxl)',

      border: {
        radius: 'var(--ion-radii-xxxxs)',
      },
    },

    IonTitle: {
      hue: {
        bold: {
          semantic: {
            default: {
              color: currentColor('foreground'),
            },
          },
        },

        subtle: {
          semantic: {
            default: {
              color: currentColor('foreground', { subtle: true }),
            },
          },
        },
      },

      letterSpacing: '0.0075em',

      size: {
        small: {
          font: {
            size: dynamicFont(global.root, 15),
            weight: 'var(--ion-font-weight-normal)',
          },

          padding: {
            top: 'var(--ion-spacing-0)',
            end: 'var(--ion-spacing-xl)',
            bottom: 'var(--ion-spacing-0)',
            start: 'var(--ion-spacing-xl)',
          },
        },

        medium: {
          font: {
            size: dynamicFont(global.root, 20),
            weight: 'var(--ion-font-weight-medium)',
          },

          padding: {
            top: 'var(--ion-spacing-0)',
            end: 'var(--ion-spacing-xl)',
            bottom: 'var(--ion-spacing-0)',
            start: 'var(--ion-spacing-xl)',
          },
        },

        large: {
          align: {
            items: 'center',
          },

          font: {
            size: dynamicFont(global.root, 28),
            weight: 'var(--ion-font-weight-normal)',
          },

          padding: {
            top: 'var(--ion-spacing-0)',
            end: 'var(--ion-spacing-xl)',
            bottom: 'var(--ion-spacing-0)',
            start: 'var(--ion-spacing-xl)',
          },
        },
      },
    },
  },
};
