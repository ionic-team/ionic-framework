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

      IonChip: {
        fill: 'solid',
        hue: 'subtle',
        shape: 'round',
        size: 'large',
      },

      IonSpinner: {
        size: 'xsmall',
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
              width: 'var(--ion-scaling-xxxxs)',
              height: 'var(--ion-scaling-xxxxs)',
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
              width: 'var(--ion-scaling-xxxs)',
              height: 'var(--ion-scaling-xxxs)',
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
              width: 'var(--ion-scaling-xxxs)',
              height: 'var(--ion-scaling-xxxs)',
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
  },
};
