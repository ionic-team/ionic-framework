/**
 * Tokens shared between the iOS theme files or are being used in the files
 * multiple times.
 */

import { dynamicFont } from '../../utils/theme';
import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';

const hexColors = {
  white: '#ffffff',
  black: '#000000',
};

const rgbColors = {
  white: '255, 255, 255',
  black: '0, 0, 0',
};

export const colors = {
  ...hexColors,

  backgroundColor: `var(--ion-background-color, ${hexColors.white})`,
  backgroundColorRgb: `var(--ion-background-color-rgb, ${rgbColors.white})`,

  textColor: `var(--ion-text-color, ${hexColors.black})`,
  textColorRgb: `var(--ion-text-color-rgb, ${rgbColors.black})`,
};

export const fontSizes = {
  chipBase: 14,
  root: parseFloat(baseDefaultTheme.fontSize!.root as string),
};

export const components = {
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
