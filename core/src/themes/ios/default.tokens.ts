import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { highContrastDarkTheme } from './high-contrast-dark.tokens';
import { highContrastTheme } from './high-contrast.tokens';
import { lightTheme } from './light.tokens';

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'ios',

  palette: {
    light: lightTheme,
    dark: darkTheme,
    highContrast: highContrastTheme,
    highContrastDark: highContrastDarkTheme,
  },

  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif',

  color: {
    'overlay-bg': 'var(--ion-overlay-background-color, var(--ion-color-gray-100))', // Available only in iOS
  },

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
    IonActionSheet: {
      buttonColorDisabled: 'var(--ion-color-gray-850)',
      buttonBgSelected: 'var(--ion-color-gray-150)',
    },
    IonBreadcrumb: {
      color: 'var(--ion-color-text-850)',
      bgFocused: 'var(--ion-color-gray-50)',
      iconColor: 'var(--ion-color-text-400)',
      iconColorActive: 'var(--ion-color-text-850)',
      iconColorFocused: 'var(--ion-color-text-750)', // Available only in iOS
      indicatorBg: 'var(--ion-color-gray-100)',
      indicatorBgFocused: 'var(--ion-color-gray-150)',
      separatorColor: 'var(--ion-color-text-550)',
    },
    IonDatetime: {
      bg: 'var(--ion-color-gray-950)',
      timeBodyBg: 'var(--ion-color-gray-300)',
    },
    IonItem: {
      paragraphTextColor: 'var(--ion-color-text-450)',
      borderColor: 'var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-gray-250)))',
    },
    IonModal: {
      handleBg: 'var(--ion-color-gray-350)',
    },
    IonPicker: {
      highlightBg: 'var(--ion-color-text-150)', // Available only in iOS
    },
    IonRange: {
      bg: 'var(--ion-color-gray-900)', // Available only in iOS
    },
    IonRefresher: {
      nativeSpinnerColor: 'var(--ion-color-gray-450)', // Available only in iOS
    },
    IonSegmentButton: {
      checkedIndicatorBg: 'var(--ion-color-gray-350)', // Available only in iOS
    },
    IonTabbar: {
      bg: 'var(--ion-tab-bar-background-color, var(--ion-color-gray-50))',
      borderColor: 'var(--ion-tab-bar-border-color, var(--ion-border-color, var(--ion-color-gray-150)))',
    },
    IonToolbar: {
      activatedButtonColor: 'var(--ion-toolbar-background, var(--background), ion-color(primary, contrast))',
      bg: 'var(--ion-toolbar-background, var(--ion-color-gray-50))',
      borderColor: 'var(--ion-toolbar-border-color, var(--ion-border-color, var(--ion-color-gray-150)))',
    },
  },
};
