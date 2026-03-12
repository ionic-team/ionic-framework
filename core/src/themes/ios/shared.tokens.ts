/**
 * Common tokens utilized multiple times across `ios` theme files.
 */

import { dynamicFont } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';

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
      end: 'var(--ion-spacing-lg)',
    },

    inner: {
      padding: {
        end: 'var(--ion-spacing-lg)',
      },
    },

    // Targets `:host([slot="start"])`
    slot: {
      start: {
        margin: {
          top: 'var(--ion-spacing-xxxs)',
          // Same as `padding-end`
          end: 'var(--ion-spacing-lg)',
          bottom: 'var(--ion-spacing-xxxs)',
          start: 'var(--ion-spacing-0)',
        },
      },
    },

    icon: {
      slot: {
        margin: {
          top: '7px',
          bottom: '7px',
        },
      },
    },

    paragraph: {
      color: 'var(--ion-text-color-step-550, #a3a3a3)',

      margin: {
        top: 'var(--ion-spacing-0)',
        end: 'var(--ion-spacing-0)',
        bottom: 'var(--ion-spacing-xxxs)',
        start: 'var(--ion-spacing-0)',
      },

      font: {
        size: dynamicFont(14),
      },
    },
  },
};
