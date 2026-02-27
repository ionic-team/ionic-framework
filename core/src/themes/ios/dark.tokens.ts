import { generateColorSteps } from '../../utils/theme';
import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import type { DarkTheme } from '../themes.interfaces';

const colors = {
  gray: generateColorSteps('#ffffff', '#000000', true),
  text: generateColorSteps('#ffffff', '#000000'),
};

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

  backgroundColor: '#000000',
  textColor: '#ffffff',

  color: {
    gray: colors.gray,
    text: colors.text,
  },

  components: {
    IonCard: {
      background: '#1c1c1d',
    },
    IonItem: {
      background: '#000000',
    },
    IonModal: {
      background: 'var(--ion-color-gray-100)',
      toolbarBackground: 'var(--ion-color-gray-150)',
      toolbarBorderColor: 'var(--ion-color-gray-250)',
    },
  },
};
