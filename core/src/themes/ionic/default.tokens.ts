import { currentColor, mix, dynamicFont, ionColor } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import { colors as baseColors } from '../base/shared.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';
import { global, components } from './shared.tokens';

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'ionic',

  palette: {
    light: lightTheme,
    dark: darkTheme,
  },

  config: {
    formHighlight: true,

    components: {
      IonBadge: {
        hue: 'subtle',
        shape: 'round',
        size: 'small',
      },

      IonButton: {
        fill: 'solid',
        hue: 'bold',
        shape: 'round',
        size: 'medium',
      },

      IonChip: {
        fill: 'solid',
        hue: 'subtle',
        shape: 'round',
        size: 'large',
      },

      IonProgressBar: {
        shape: 'round',
      },

      IonSpinner: {
        size: 'xsmall',
      },

      IonText: {
        hue: 'bold',
      },
    },
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
    IonBadge: {
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
            radius: 'var(--ion-radii-sm)',
          },
        },

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

      // Sizes
      size: {
        small: {
          content: {
            letterSpacing: '0%',
            height: 'var(--ion-scaling-xxxs)',

            min: {
              width: 'var(--ion-scaling-xxxs)',
            },

            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-xxxs)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-xxxs)',
            },

            font: {
              size: 'var(--ion-font-size-xs)',
              weight: 'var(--ion-font-weight-medium)',
            },

            line: {
              height: 'var(--ion-scaling-xxs)',
            },

            icon: {
              font: {
                size: 'var(--ion-scaling-xxxxs)',
              },
            },
          },

          dot: {
            height: 'var(--ion-scaling-200)',

            min: {
              width: 'var(--ion-scaling-200)',
            },
          },
        },

        medium: {
          content: {
            letterSpacing: '0%',
            height: 'var(--ion-scaling-xs)',

            min: {
              width: 'var(--ion-scaling-xs)',
            },

            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-xxs)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-xxs)',
            },

            font: {
              size: 'var(--ion-font-size-sm)',
              weight: 'var(--ion-font-weight-medium)',
            },

            line: {
              height: 'var(--ion-scaling-xs)',
            },

            icon: {
              font: {
                size: 'var(--ion-scaling-xxxs)',
              },
            },
          },

          dot: {
            height: 'var(--ion-scaling-xxxxs)',

            min: {
              width: 'var(--ion-scaling-xxxxs)',
            },
          },
        },

        large: {
          content: {
            letterSpacing: '0%',
            height: 'var(--ion-scaling-md)',

            min: {
              width: 'var(--ion-scaling-md)',
            },

            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-xs)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-xs)',
            },

            font: {
              size: 'var(--ion-font-size-md)',
              weight: 'var(--ion-font-weight-medium)',
            },

            line: {
              height: 'var(--ion-scaling-sm)',
            },

            icon: {
              font: {
                size: 'var(--ion-scaling-xxs)',
              },
            },
          },

          dot: {
            height: 'var(--ion-scaling-xxxs)',

            min: {
              width: 'var(--ion-scaling-xxxs)',
            },
          },
        },
      },
    },

    IonButton: {
      margin: {
        top: 'var(--ion-spacing-0)',
        end: 'var(--ion-spacing-0)',
        bottom: 'var(--ion-spacing-0)',
        start: 'var(--ion-spacing-0)',
      },

      transition: 'none',

      font: {
        family: 'var(--ion-font-family)',
      },

      letter: {
        spacing: '0.01em',
      },

      // Hues
      hue: {
        bold: {
          solid: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            default: {
              background: ionColor('primary', 'base'),
              color: ionColor('primary', 'contrast'),

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: ionColor('primary', 'base'),
              color: ionColor('primary', 'contrast'),
            },

            hover: {
              background: ionColor('primary', 'shade'),
              color: ionColor('primary', 'contrast'),
            },

            activated: {
              background: ionColor('primary', 'shade'),
              color: ionColor('primary', 'contrast'),
            },

            // A white wash over the button
            disabled: {
              background: ionColor('primary', 'base'),

              opacity: '0.4',
            },

            rippleEffect: {
              color: ionColor('primary', 'shade'),
              opacity: '1',
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base'),
                color: currentColor('contrast'),
              },

              focus: {
                background: currentColor('base'),
                color: currentColor('contrast'),
              },

              hover: {
                background: currentColor('shade'),
                color: currentColor('contrast'),
              },

              activated: {
                background: currentColor('shade'),
                color: currentColor('contrast'),
              },

              disabled: {
                background: currentColor('base'),
              },

              rippleEffect: {
                color: currentColor('shade'),
                opacity: '1',
              },
            },
          },

          outline: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            default: {
              background: baseColors.backgroundColor,
              color: ionColor('primary', 'foreground'),

              border: {
                color: ionColor('primary', 'base'),
                style: 'solid',
                width: 'var(--ion-border-width-xxxs)',
              },

              font: {
                weight: 'var(--ion-font-weight-medium)',
              },
            },

            focus: {
              background: baseColors.backgroundColor,
              color: ionColor('primary', 'foreground'),
            },

            hover: {
              background: ionColor('primary', 'shade', { subtle: true }),
              color: ionColor('primary', 'foreground'),
            },

            activated: {
              background: ionColor('primary', 'shade', { subtle: true }),
              color: ionColor('primary', 'foreground'),
            },

            // A white wash over the button
            disabled: {
              background: baseColors.backgroundColor,

              opacity: '0.4',
            },

            rippleEffect: {
              color: ionColor('primary', 'shade', { subtle: true }),
              opacity: '1',
            },

            semantic: {
              default: {
                background: baseColors.backgroundColor,
                color: currentColor('foreground'),

                border: {
                  color: currentColor('base'),
                },
              },

              focus: {
                background: baseColors.backgroundColor,
                color: currentColor('foreground'),
              },

              hover: {
                background: currentColor('shade', { subtle: true }),
                color: currentColor('foreground'),
              },

              activated: {
                background: currentColor('shade', { subtle: true }),
                color: currentColor('foreground'),
              },

              disabled: {
                background: baseColors.backgroundColor,
              },

              rippleEffect: {
                color: currentColor('shade', { subtle: true }),
                opacity: '1',
              },
            },
          },

          clear: {
            strong: {
              font: {
                weight: 'var(--ion-font-weight-medium)',
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
              background: 'transparent',
              color: ionColor('primary', 'foreground'),
            },

            hover: {
              background: ionColor('primary', 'shade', { subtle: true }),
              color: ionColor('primary', 'foreground'),
            },

            activated: {
              background: ionColor('primary', 'shade', { subtle: true }),
              color: ionColor('primary', 'foreground'),
            },

            // A white wash over the button
            disabled: {
              background: 'transparent',

              opacity: '0.4',
            },

            rippleEffect: {
              color: ionColor('primary', 'shade', { subtle: true }),
              opacity: '1',
            },

            semantic: {
              default: {
                background: 'transparent',
                color: currentColor('foreground'),
              },

              focus: {
                background: 'transparent',
                color: currentColor('foreground'),
              },

              hover: {
                background: currentColor('shade', { subtle: true }),
                color: currentColor('foreground'),
              },

              activated: {
                background: currentColor('shade', { subtle: true }),
                color: currentColor('foreground'),
              },

              disabled: {
                background: 'transparent',
              },

              rippleEffect: {
                color: currentColor('shade', { subtle: true }),
                opacity: '1',
              },
            },
          },
        },
      },

      // Sizes
      size: {
        small: {
          min: {
            height: 'var(--ion-scaling-lg)',
            width: 'var(--ion-scaling-1600)',
          },

          padding: {
            top: 'var(--ion-spacing-0)',
            end: 'var(--ion-spacing-lg)',
            bottom: 'var(--ion-spacing-0)',
            start: 'var(--ion-spacing-lg)',
          },

          font: {
            size: dynamicFont(global.root, 14),
          },

          line: {
            height: dynamicFont(global.root, 20),
          },

          icon: {
            font: {
              size: dynamicFont(global.root, 20),
            },

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

          iconOnly: {
            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-0)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-0)',
            },

            icon: {
              font: {
                size: dynamicFont(global.root, 20),
              },
            },
          },

          spinner: {
            // `xsmall` is the theme's default spinner size; each larger size steps up 4px
            size: {
              xsmall: {
                height: 'var(--ion-scaling-xxs)',
                width: 'var(--ion-scaling-xxs)',
              },

              small: {
                height: 'var(--ion-scaling-xs)',
                width: 'var(--ion-scaling-xs)',
              },

              medium: {
                height: 'var(--ion-scaling-sm)',
                width: 'var(--ion-scaling-sm)',
              },

              large: {
                height: 'var(--ion-scaling-md)',
                width: 'var(--ion-scaling-md)',
              },

              xlarge: {
                height: 'var(--ion-scaling-900)',
                width: 'var(--ion-scaling-900)',
              },
            },

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
            height: 'var(--ion-scaling-xl)',
            width: 'var(--ion-scaling-xxxl)',
          },

          padding: {
            top: 'var(--ion-spacing-0)',
            end: 'var(--ion-spacing-xl)',
            bottom: 'var(--ion-spacing-0)',
            start: 'var(--ion-spacing-xl)',
          },

          font: {
            size: dynamicFont(global.root, 16),
          },

          line: {
            height: dynamicFont(global.root, 24),
          },

          icon: {
            font: {
              size: dynamicFont(global.root, 20),
            },

            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-250)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-0)',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-0)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-250)',
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
                size: dynamicFont(global.root, 20),
              },
            },
          },

          spinner: {
            // `xsmall` is the theme's default spinner size; each larger size steps up 4px
            size: {
              xsmall: {
                height: 'var(--ion-scaling-xxs)',
                width: 'var(--ion-scaling-xxs)',
              },

              small: {
                height: 'var(--ion-scaling-xs)',
                width: 'var(--ion-scaling-xs)',
              },

              medium: {
                height: 'var(--ion-scaling-sm)',
                width: 'var(--ion-scaling-sm)',
              },

              large: {
                height: 'var(--ion-scaling-md)',
                width: 'var(--ion-scaling-md)',
              },

              xlarge: {
                height: 'var(--ion-scaling-900)',
                width: 'var(--ion-scaling-900)',
              },
            },

            leading: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-250)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-0)',
              },
            },

            trailing: {
              margin: {
                top: 'var(--ion-spacing-0)',
                end: 'var(--ion-spacing-0)',
                bottom: 'var(--ion-spacing-0)',
                start: 'var(--ion-spacing-250)',
              },
            },
          },
        },

        large: {
          min: {
            height: 'var(--ion-scaling-xxl)',
            width: 'var(--ion-scaling-xxxxl)',
          },

          padding: {
            top: 'var(--ion-spacing-0)',
            end: 'var(--ion-spacing-xxxl)',
            bottom: 'var(--ion-spacing-0)',
            start: 'var(--ion-spacing-xxxl)',
          },

          font: {
            size: dynamicFont(global.root, 20),
          },

          line: {
            height: dynamicFont(global.root, 24),
          },

          icon: {
            font: {
              size: dynamicFont(global.root, 24),
            },

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

          iconOnly: {
            padding: {
              top: 'var(--ion-spacing-0)',
              end: 'var(--ion-spacing-0)',
              bottom: 'var(--ion-spacing-0)',
              start: 'var(--ion-spacing-0)',
            },

            icon: {
              font: {
                size: dynamicFont(global.root, 24),
              },
            },
          },

          spinner: {
            // `xsmall` is the theme's default spinner size; each larger size steps up 4px
            size: {
              xsmall: {
                height: 'var(--ion-scaling-xs)',
                width: 'var(--ion-scaling-xs)',
              },

              small: {
                height: 'var(--ion-scaling-sm)',
                width: 'var(--ion-scaling-sm)',
              },

              medium: {
                height: 'var(--ion-scaling-md)',
                width: 'var(--ion-scaling-md)',
              },

              large: {
                height: 'var(--ion-scaling-900)',
                width: 'var(--ion-scaling-900)',
              },

              xlarge: {
                height: 'var(--ion-scaling-lg)',
                width: 'var(--ion-scaling-lg)',
              },
            },

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
            radius: 'var(--ion-radii-sm)',
          },
        },

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

      // States
      state: {
        focus: {
          ring: {
            color: '#b5c0f7',
            offset: 'var(--ion-border-width-xxs)',
            style: 'solid',
            width: 'var(--ion-border-width-xxs)',
          },
        },
      },
    },

    // Parents that theme the buttons they contain
    IonInputPasswordToggle: {
      IonButton: {
        hue: {
          bold: {
            clear: {
              default: {
                color: '#6c727a',
              },

              focus: {
                color: '#6c727a',
              },

              hover: {
                color: '#6c727a',
              },

              activated: {
                color: '#6c727a',
              },
            },
          },
        },
      },
    },

    IonToolbar: {
      IonButton: {
        /**
         * In a toolbar without a color, the global `--ion-toolbar-color` and
         * `--ion-toolbar-background` properties color the buttons.
         */
        hue: {
          bold: {
            solid: {
              default: {
                background: `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
              },

              focus: {
                color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
              },

              hover: {
                color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
              },

              activated: {
                color: `var(--ion-toolbar-background, ${ionColor('primary', 'contrast')})`,
              },
            },

            // Transparent so the text, which takes the toolbar color, stays readable on any toolbar background
            outline: {
              default: {
                background: 'transparent',
                color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,

                border: {
                  color: `var(--ion-toolbar-color, ${ionColor('primary', 'base')})`,
                },
              },

              focus: {
                background: 'transparent',
                color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,
              },

              hover: {
                color: `var(--ion-toolbar-color, ${ionColor('primary', 'foreground')})`,
              },

              disabled: {
                background: 'transparent',
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
              // Clear buttons in a toolbar use the default text color and have no state backgrounds
              clear: {
                default: {
                  color: 'var(--ion-toolbar-color, #242528)',
                },

                focus: {
                  background: 'transparent',
                  color: 'var(--ion-toolbar-color, #242528)',
                },

                hover: {
                  background: 'transparent',
                  color: 'var(--ion-toolbar-color, #242528)',
                },

                activated: {
                  background: 'transparent',
                  color: 'var(--ion-toolbar-color, #242528)',
                },

                rippleEffect: {
                  color: 'transparent',
                },
              },
            },
          },

          // Toolbar buttons are shorter than standalone ones; icon-only ones are squares of this height
          size: {
            medium: {
              min: {
                height: 'var(--ion-scaling-lg)',
              },
            },
          },
        },
      },
    },

    IonChip: {
      margin: {
        top: 'var(--ion-spacing-0)',
        end: 'var(--ion-spacing-0)',
        bottom: 'var(--ion-spacing-0)',
        start: 'var(--ion-spacing-0)',
      },

      padding: {
        top: 'var(--ion-spacing-xs)',
        end: 'var(--ion-spacing-sm)',
        bottom: 'var(--ion-spacing-xs)',
        start: 'var(--ion-spacing-sm)',
      },

      lineHeight: '100%',
      letterSpacing: '0%',
      gap: 'var(--ion-spacing-xxs)',

      font: {
        weight: 500,
      },

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
            style: 'solid',
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
          solid: {
            // Default non-semantic states
            default: {
              background: '#3b3b3b',
              color: '#ffffff',
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base'),
                color: currentColor('contrast'),
              },
            },
          },

          outline: {
            // Default non-semantic states
            default: {
              background: '#3b3b3b',
              color: '#ffffff',

              border: {
                color: '#242424',
                style: 'solid',
                width: '1px',
              },
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base'),
                color: currentColor('contrast'),

                border: {
                  color: currentColor('shade'),
                  style: 'solid',
                  width: '1px',
                },
              },
            },
          },
        },

        subtle: {
          solid: {
            // Default non-semantic states
            default: {
              background: '#f3f3f3',
              color: '#626262',
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', { subtle: true }),
                color: currentColor('contrast', { subtle: true }),
              },
            },
          },

          outline: {
            // Default non-semantic states
            default: {
              background: '#f3f3f3',
              color: '#626262',

              border: {
                color: '#e0e0e0',
                style: 'solid',
                width: '1px',
              },
            },

            // Any of the semantic colors like primary, secondary, etc.
            semantic: {
              default: {
                background: currentColor('base', { subtle: true }),
                color: currentColor('contrast', { subtle: true }),

                border: {
                  color: currentColor('shade', { subtle: true }),
                  style: 'solid',
                  width: '1px',
                },
              },
            },
          },
        },
      },

      icon: {
        font: {
          size: 'var(--ion-scaling-xxxs)',
        },
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
      },
    },

    IonContent: {
      default: {
        background: baseColors.backgroundColor,
        color: baseColors.textColor,
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
      },

      columns: 12,
    },

    IonItemDivider: {
      background: baseColors.backgroundColor,
      color: `var(--ion-text-color-step-600, ${mix(baseColors.white, baseColors.black, '40%')})`,
      minHeight: 'var(--ion-scaling-750)',

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

        font: {
          size: dynamicFont(global.root, components.item.note.slot.font.size),
        },

        margin: {
          top: 'var(--ion-spacing-0)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-0)',
          start: 'var(--ion-spacing-0)',
        },

        padding: {
          top: components.item.note.slot.padding.top,
          end: components.item.note.slot.padding.end,
          bottom: components.item.note.slot.padding.bottom,
          start: components.item.note.slot.padding.start,
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
              background: '#eae9e9',
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
              background: '#eae9e9',
            },
          },

          circles: {
            default: {
              background: '#eae9e9',
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

      lineHeight: 'var(--ion-scaling-250)',

      margin: {
        bottom: 'var(--ion-spacing-xxs)',
        top: 'var(--ion-spacing-xxs)',
      },
    },

    IonSpinner: {
      color: '#626262',

      lines: {
        stroke: {
          width: 'var(--ion-scaling-150)',
        },

        small: {
          stroke: {
            width: 'var(--ion-scaling-150)',
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
          width: 'var(--ion-scaling-xs)',
          height: 'var(--ion-scaling-xs)',
        },

        small: {
          width: 'var(--ion-scaling-md)',
          height: 'var(--ion-scaling-md)',
        },

        medium: {
          width: 'var(--ion-scaling-lg)',
          height: 'var(--ion-scaling-lg)',
        },

        large: {
          width: 'var(--ion-scaling-xl)',
          height: 'var(--ion-scaling-xl)',
        },

        xlarge: {
          width: 'var(--ion-scaling-xxl)',
          height: 'var(--ion-scaling-xxl)',
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
      height: 'var(--ion-scaling-xl)',
      width: 'var(--ion-scaling-xl)',

      border: {
        radius: 'var(--ion-radii-xxxxs)',
      },
    },
  },
};
