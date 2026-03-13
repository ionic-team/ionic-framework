import { currentColor, mix, dynamicFont } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import { colors as baseColors } from '../base/shared.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';
import { components } from './shared.tokens';

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
      IonChip: {
        fill: 'solid',
        hue: 'subtle',
        shape: 'round',
        size: 'large',
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
                background: currentColor('base', null, true),
                color: currentColor('contrast', null, true),
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
                background: currentColor('base', null, true),
                color: currentColor('contrast', null, true),

                border: {
                  color: currentColor('shade', null, true),
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
        size: dynamicFont(components.itemDivider.font.size),
      },

      leading: {
        // Targets `::slotted([slot="start"])`
        edge: {
          margin: {
            end: components.item.start.slot.margin.end,
          },
        },
      },

      trailing: {
        // Targets `::slotted([slot="end"])`
        edge: {
          margin: {
            start: components.item.end.slot.margin.start,
          },
        },
      },

      // Targets `ion-label`
      label: {
        margin: {
          top: '13px',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-250)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `ion-icon`
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

        leading: {
          // Targets `ion-icon[slot="start"]`
          edge: {
            margin: {
              top: components.item.icon.slot.margin.top,
              end: components.item.icon.start.slot.margin.end,
              bottom: components.item.icon.slot.margin.bottom,
            },
          },
        },

        trailing: {
          // Targets `ion-icon[slot="end"]`
          edge: {
            margin: {
              top: components.item.icon.slot.margin.top,
              start: components.item.icon.end.slot.margin.start,
              bottom: components.item.icon.slot.margin.bottom,
            },
          },
        },

        // Default non-semantic states
        default: {
          color: components.item.icon.slot.color,
        },

        // Any of the semantic colors like primary, secondary, etc.
        semantic: {
          default: {
            color: currentColor('contrast'),
          },
        },
      },

      // Targets `ion-note`
      note: {
        align: {
          self: 'flex-start',
        },

        font: {
          size: dynamicFont(components.item.note.slot.font.size),
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

      // Targets `ion-avatar`
      avatar: {
        height: components.item.avatar.height,
        width: components.item.avatar.width,

        margin: {
          top: components.item.media.slot.margin.top,
          bottom: components.item.media.slot.margin.bottom,
        },

        leading: {
          // Targets `ion-avatar[slot="start"]`
          edge: {
            margin: {
              end: components.item.media.start.slot.margin.end,
            },
          },
        },

        trailing: {
          // Targets `ion-avatar[slot="end"]`
          edge: {
            margin: {
              start: components.item.media.end.slot.margin.start,
            },
          },
        },
      },

      // Targets `ion-thumbnail`
      thumbnail: {
        // TODO: switch from size to height and width
        height: components.item.thumbnail.height,
        width: components.item.thumbnail.width,

        margin: {
          top: components.item.media.slot.margin.top,
          bottom: components.item.media.slot.margin.bottom,
        },

        leading: {
          // Targets `ion-thumbnail[slot="start"]`
          edge: {
            margin: {
              end: components.item.media.start.slot.margin.end,
            },
          },
        },

        trailing: {
          // Targets `ion-thumbnail[slot="end"]`
          edge: {
            margin: {
              start: components.item.media.end.slot.margin.start,
            },
          },
        },
      },

      // Targets `h1`
      header1: {
        margin: {
          top: 'var(--ion-spacing-0)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `h2`
      header2: {
        margin: {
          top: 'var(--ion-spacing-xxxs)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `h3`
      header3: {
        margin: {
          top: 'var(--ion-spacing-xxxs)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `h4`
      header4: {
        margin: {
          top: 'var(--ion-spacing-xxxs)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `h5`
      header5: {
        margin: {
          top: 'var(--ion-spacing-xxxs)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `h6`
      header6: {
        margin: {
          top: 'var(--ion-spacing-xxxs)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },

      // Targets `p`
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
          size: dynamicFont(14),
        },

        text: {
          overflow: 'initial',
        },
      },
    },
  },
};
