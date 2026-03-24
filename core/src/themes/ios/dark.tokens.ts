import { generateColorSteps } from '../../utils/theme';
import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import type { DarkTheme } from '../themes.interfaces';

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

  backgroundColorStep: generateColorSteps('#000000', '#ffffff'),
  textColorStep: generateColorSteps('#ffffff', '#000000'),

  components: {
    IonCard: {
      background: '#1c1c1d',
    },
    IonItem: {
      background: '#000000',
    },
    IonModal: {
      background: 'var(--ion-background-color-step-100)',
      toolbarBackground: 'var(--ion-background-color-step-150)',
      toolbarBorderColor: 'var(--ion-background-color-step-250)',
    },
  },
};
