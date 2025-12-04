import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import { darkPrimitiveColors as baseDarkPrimitiveColors } from '../base/dark.tokens.primitives';
import type { DarkTheme } from '../themes.interfaces';

const colors = {
  background: '#000000',
  textColor: '#ffffff',
  gray: baseDarkPrimitiveColors.gray,
};

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

  backgroundColor: colors.background,
  textColor: colors.textColor,

  color: {
    gray: colors.gray,
  },

  components: {
    IonCard: {
      background: '#1c1c1d',
    },
    IonItem: {
      background: '#000000',
    },
    IonModal: {
      bg: 'var(--ion-color-gray-100)',
      toolbarBg: 'var(--ion-color-gray-150)',
      toolbarBorderColor: 'var(--ion-color-gray-250)',
    },
  },
};
