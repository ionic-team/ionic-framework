import { colors as defaultColors } from '../base/default.tokens';
import type { LightTheme } from '../themes.interfaces';

export const lightTheme: LightTheme = {
  components: {
    IonBreadcrumb: {
      color: '#677483',
      backgroundFocused: defaultColors.white,
      iconColor: '#7d8894',
      iconColorActive: '#222d3a',
      indicatorBackground: '#eef1f3',
      indicatorBackgroundFocused: '#dfe5e8',
      colorFocused: '#35404e',
      separatorColor: '#73849a',
    },
    IonDatetime: {
      background: defaultColors.white,
      timeBodyBackground: '#edeef0',
    },
    IonItem: {
      borderColor: 'var(--ion-item-border-color, var(--ion-border-color, rgba(0, 0, 0, 0.13)))',
    },
    IonModal: {
      handleBackground: '#c0c0be',
    },
    IonRefresher: {
      nativeSpinnerBorder: '#ececec',
      nativeSpinnerBackground: defaultColors.white,
    },
    IonTabBar: {
      borderColor: 'var(--ion-border-color, rgba(0, 0, 0, 0.07))',
    },
    IonToolbar: {
      background: `var(--ion-background-color, ${defaultColors.white})`,
      borderColor: 'var(--ion-border-color, #c1c4cd)',
    },
  },
};
