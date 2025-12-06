import { colors as defaultColors } from '../base/default.tokens';
import type { LightTheme } from '../themes.interfaces';

export const lightTheme: LightTheme = {
  components: {
    IonBreadcrumb: {
      color: '#677483',
      bgFocused: defaultColors.white,
      iconColor: '#7d8894',
      iconColorActive: '#222d3a',
      indicatorBg: '#eef1f3',
      indicatorBgFocused: '#dfe5e8',
      colorFocused: '#35404e', // Available only in md
      separatorColor: '#73849a',
    },
    IonDatetime: {
      bg: defaultColors.white,
      timeBodyBg: '#edeef0',
    },
    IonItem: {
      borderColor: 'var(--ion-item-border-color, var(--ion-border-color, rgba(0, 0, 0, 0.13)))',
    },
    IonModal: {
      handleBg: '#c0c0be',
    },
    IonRefresher: {
      nativeSpinnerBorder: '#ececec', // Available only in md
      nativeSpinnerBg: defaultColors.white, // Available only in md
    },
    IonTabBar: {
      borderColor: 'var(--ion-border-color, rgba(0, 0, 0, 0.07))',
    },
    IonToolbar: {
      bg: `var(--ion-background-color, ${defaultColors.white})`,
      borderColor: 'var(--ion-border-color, #c1c4cd)',
    },
  },
};
