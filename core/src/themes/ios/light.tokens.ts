import { colors as defaultColors } from '../base/default.tokens';
import type { LightTheme } from '../themes.interfaces';

const colors = {
  gray: defaultColors.gray,
};

export const lightTheme: LightTheme = {
  color: {
    gray: colors.gray,
    'overlay-background': 'var(--ion-overlay-background-color, #f9f9f9)',
  },
  components: {
    IonActionSheet: {
      buttonBackgroundSelected: `var(--ion-background-color, ${defaultColors.white})`,
    },
    IonDatetime: {
      timeBodyBackground: '#edeef0',
    },
    IonBreadcrumb: {
      color: '#2d4665',
      backgroundFocused: 'rgba(233, 237, 243, 0.7)',
      iconColor: '#92a0b3',
      iconColorActive: '#242d39',
      iconColorFocused: '#445b78',
      indicatorBackground: '#e9edf3',
      indicatorBackgroundFocused: '#d9e0ea',
      separatorColor: '#73849a',
    },
    IonItem: {
      paragraphTextColor: '#a3a3a3',
      borderColor: 'var(--ion-item-border-color, var(--ion-border-color, #c8c7cc))',
    },
    IonModal: {
      handleBackground: '#c0c0be',
    },
    IonPicker: {
      highlightBackground: '#eeeeef',
    },
    IonRange: {
      background: 'var(--ion-color-gray-100)',
    },
    IonRefresher: {
      nativeSpinnerColor: '#747577',
    },
    IonSegmentButton: {
      checkedIndicatorBackground: defaultColors.white,
    },
    IonTabBar: {
      background: 'var(--ion-tab-bar-background-color, #f7f7f7)',
      borderColor: 'var(--ion-border-color, rgba(0, 0, 0, 0.2))',
    },
    IonToolbar: {
      background: '#f7f7f7',
      borderColor: 'var(--ion-border-color, rgba(0, 0, 0, 0.2))',
    },
  },
};
