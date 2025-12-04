import { defaultPrimitiveColors } from '../base/default.tokens.primitives';
import type { LightTheme } from '../themes.interfaces';

const colors = {
  gray: defaultPrimitiveColors.gray,
};

export const lightTheme: LightTheme = {
  color: {
    gray: colors.gray,
    'overlay-bg': 'var(--ion-overlay-background-color, #f9f9f9)', // Available only in iOS
  },
  components: {
    IonActionSheet: {
      buttonBgSelected: 'var(--ion-background-color)',
    },
    IonDatetime: {
      timeBodyBg: '#edeef0',
    },
    IonBreadcrumb: {
      color: '#2d4665',
      bgFocused: 'rgba(233, 237, 243, 0.7)',
      iconColor: '#92a0b3',
      iconColorActive: '#242d39',
      iconColorFocused: '#445b78', // Available only in iOS
      indicatorBg: '#e9edf3',
      indicatorBgFocused: '#d9e0ea',
      separatorColor: '#73849a',
    },
    IonItem: {
      paragraphTextColor: '#a3a3a3',
      borderColor:
        'var(--ion-components-ion-item-border-color, var(--ion-item-border-color, var(--ion-border-color, #c8c7cc)))',
    },
    IonModal: {
      handleBg: '#c0c0be',
    },
    IonPicker: {
      highlightBg: '#eeeeef', // Available only in iOS
    },
    IonRange: {
      bg: 'var(--ion-color-gray-100)', // Available only in iOS
    },
    IonRefresher: {
      nativeSpinnerColor: '#747577', // Available only in iOS
    },
    IonSegmentButton: {
      checkedIndicatorBg: defaultPrimitiveColors.white, // Available only in iOS
    },
    IonTabbar: {
      bg: 'var(--ion-tab-bar-background-color, #f7f7f7)',
      borderColor: 'var(--ion-tab-bar-border-color, var(--ion-border-color, rgba(0, 0, 0, 0.2)))',
    },
    IonToolbar: {
      bg: 'var(--ion-toolbar-background, #f7f7f7)',
      borderColor: 'var(--ion-toolbar-border-color, var(--ion-border-color, rgba(0, 0, 0, 0.2)))',
    },
  },
};
