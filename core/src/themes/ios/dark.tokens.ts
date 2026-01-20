import { darkTheme as baseDarkTheme, colors as defaultDarkColors } from '../base/dark.tokens';
import { colors as defaultColors } from '../base/default.tokens';
import type { DarkTheme } from '../themes.interfaces';

const colors = {
  background: defaultColors.black,
  textColor: defaultColors.white,
  gray: defaultDarkColors.gray,
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
      bg: '#000000',
    },
    IonModal: {
      bg: 'var(--ion-color-gray-100)',
      toolbarBg: 'var(--ion-color-gray-150)',
      toolbarBorderColor: 'var(--ion-color-gray-250)',
    },
  },
};
