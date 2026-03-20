/**
 * Common tokens utilized multiple times across `ionic` theme files.
 */

import { mix, rgba } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import { colors as baseColors } from '../base/shared.tokens';

export const global = {
  root: parseFloat(baseDefaultTheme.fontSize!.root as string),
};

export const components = {
  item: {
    padding: {
      start: 'var(--ion-spacing-lg)',
    },

    inner: {
      padding: {
        end: 'var(--ion-spacing-lg)',
      },
    },

    border: {
      color: `var(--ion-item-border-color, var(--ion-border-color, var(--ion-background-color-step-150, ${rgba(
        baseColors.textColorRgb,
        0.13
      )})))`,
    },

    // Targets host with slots or all children with slots
    slot: {
      child: {
        // Targets `::slotted([slot="start"])`
        start: {
          margin: {
            end: 'var(--ion-spacing-lg)',
          },
        },

        // Targets `::slotted([slot="end"])`
        end: {
          margin: {
            start: 'var(--ion-spacing-lg)',
          },
        },
      }
    },

    icon: {
      slot: {
        color: rgba(baseColors.textColorRgb, 0.54),

        font: {
          size: 24,
        },

        margin: {
          top: 'var(--ion-spacing-md)',
          bottom: 'var(--ion-spacing-md)',
        },
      },

      start: {
        slot: {
          margin: {
            end: 'var(--ion-spacing-xxxxl)',
          },
        },
      },

      end: {
        slot: {
          margin: {
            start: 'var(--ion-spacing-lg)',
          },
        },
      },
    },

    note: {
      slot: {
        font: {
          size: 11,
        },

        padding: {
          top: 'var(--ion-spacing-450)',
          end: 'var(--ion-spacing-0)',
          bottom: 'var(--ion-spacing-250)',
          start: 'var(--ion-spacing-0)',
        },
      },
    },

    avatar: {
      width: 'var(--ion-scaling-xl)',
      height: 'var(--ion-scaling-xl)',
    },

    thumbnail: {
      width: 'var(--ion-scaling-1400)',
      height: 'var(--ion-scaling-1400)',
    },

    // media: avatar and thumbnail
    media: {
      slot: {
        margin: {
          top: 'var(--ion-spacing-sm)',
          bottom: 'var(--ion-spacing-sm)',
        },
      },

      start: {
        slot: {
          margin: {
            end: 'var(--ion-spacing-lg)',
          },
        },
      },

      end: {
        slot: {
          margin: {
            start: 'var(--ion-spacing-lg)',
          },
        },
      },
    },

    paragraph: {
      color: `var(--ion-text-color-400, ${mix(baseColors.white, baseColors.black, '40%')})`,
    },
  },

  itemDivider: {
    font: {
      size: 14,
    },
  },
};
