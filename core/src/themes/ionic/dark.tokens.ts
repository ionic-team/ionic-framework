import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import type { DarkTheme } from '../themes.interfaces';

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

  components: {
    IonDatetimeButton: {
      bg: '#595959',
    },
  },
};
