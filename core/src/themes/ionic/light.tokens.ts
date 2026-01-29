import type { LightTheme } from '../themes.interfaces';

export const lightTheme: LightTheme = {
  backgroundColor: '#ffffff',
  backgroundColorRgb: '255, 255, 255',
  textColor: '#000000',
  textColorRgb: '0, 0, 0',

  components: {
    IonCard: {
      background: '#ffffff',
    },
    IonItem: {
      background: '#ffffff',
    },
    IonTabBar: {
      background: 'var(--ion-tab-bar-background, #ffffff)',
      backgroundActivated: 'var(--ion-tab-bar-background-activated, #f2f4fd)',
      backgroundFocused: 'var(--ion-tab-bar-background-focused, transparent)',
      color: 'var(--ion-tab-bar-color, #626262)',
      colorSelected: 'var(--ion-tab-bar-color-selected, #0d4bc3)',
      borderColor: 'var(--ion-tab-bar-border-color, transparent)',
    },
  },
};
