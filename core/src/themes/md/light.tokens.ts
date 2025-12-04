import { defaultPrimitiveColors } from '../base/default.tokens.primitives';
import type { LightTheme } from '../themes.interfaces';

export const lightTheme: LightTheme = {
  components: {
    IonBreadcrumb: {
      color: '#677483',
      bgFocused: defaultPrimitiveColors.white,
      iconColor: '#7d8894',
      iconColorActive: '#222d3a',
      indicatorBg: '#eef1f3',
      indicatorBgFocused: '#dfe5e8',
      colorFocused: '#35404e', // Available only in md
      separatorColor: '#73849a',
    },
    IonDatetime: {
      bg: defaultPrimitiveColors.white,
      timeBodyBg: '#edeef0',
    },
    IonItem: {
      borderColor: 'var(--ion-components-ion-item-border-color, var(--ion-item-border-color, var(--ion-border-color, rgba(0, 0, 0, 0.13))))',
    },
    IonModal: {
      handleBg: '#c0c0be',
    },
    IonRefresher: {
      nativeSpinnerBorder: '#ececec', // Available only in md
      nativeSpinnerBg: '#ffffff', // Available only in md
    },
    IonTabBar: {
      borderColor: 'var(--ion-tab-bar-border-color, var(--ion-border-color, rgba(0, 0, 0, 0.07)))',
    },
    IonToolbar: {
      borderColor: 'var(--ion-toolbar-border-color, var(--ion-border-color, #c1c4cd))',
    },
  },
};
