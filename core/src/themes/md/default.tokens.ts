import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { highContrastDarkTheme } from './high-contrast-dark.tokens';
import { highContrastTheme } from './high-contrast.tokens';
import { lightTheme } from './light.tokens';

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
    IonBreadcrumb: {
      color: 'var(--ion-color-text-600)',
      colorFocused: 'var(--ion-color-text-800)', // Available only in md
      iconColor: 'var(--ion-color-text-550)',
      iconColorActive: 'var(--ion-color-text-850)',
      bgFocused: 'var(--ion-color-gray-50)',
      indicatorBg: 'var(--ion-color-gray-100)',
      indicatorBgFocused: 'var(--ion-color-gray-150)',
      separatorColor: 'var(--ion-color-gray-550)',
    },
    IonDatetime: {
      bg: 'var(--ion-color-gray-100)',
      timeBodyBg: 'var(--ion-color-gray-300)',
    },
    IonDatetimeButton: {
      bg: 'var(--ion-color-gray-300)',
    },
    IonItem: {
      borderColor: 'var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-gray-150)))',
    },
    IonModal: {
      handleBg: 'var(--ion-color-gray-350)',
    },
    IonRefresher: {
      nativeSpinnerBorder: 'var(--ion-color-gray-200)', // Available only in md
      nativeSpinnerBg: 'var(--ion-color-gray-250)', // Available only in md
    },
    IonTabBar: {
      borderColor: 'var(--ion-tab-bar-border-color, var(--ion-border-color, var(--ion-color-gray-150)))',
    },
    IonToolbar: {
      borderColor: 'var(--ion-toolbar-border-color, var(--ion-border-color, var(--ion-color-gray-150)))',
    },
  },
};
