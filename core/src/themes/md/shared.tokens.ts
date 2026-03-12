/**
 * Common tokens utilized multiple times across `md` theme files.
 */

import { mix, rgba } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import { colors as baseColors } from '../base/shared.tokens';

export const global = {
  root: parseFloat(baseDefaultTheme.fontSize!.root as string),
};

export const components = {
  chip: {
    font: {
      size: 14,
    },
  },

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

    // ::slotted([slot="start"])
    start: {
      slot: {
        margin: {
          end: 'var(--ion-spacing-lg)',
        },
      },
    },

    // ::slotted([slot="end"])
    end: {
      slot: {
        margin: {
          start: 'var(--ion-spacing-lg)',
        },
      },
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
          end: null,
          bottom: 'var(--ion-spacing-sm)',
          start: null,
        },
      },

      start: {
        slot: {
          margin: {
            end: 'var(--ion-spacing-lg)',
            start: null,
          },
        },
      },

      end: {
        slot: {
          margin: {
            end: null,
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
