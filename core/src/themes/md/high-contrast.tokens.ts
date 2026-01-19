import { highContrastTheme as baseHighContrastTheme } from '../base/high-contrast.tokens';
import type { HighContrastTheme } from '../themes.interfaces';

export const highContrastTheme: HighContrastTheme = {
  ...baseHighContrastTheme,

  components: {
    IonToolbar: {
      bg: '#1f1f1f',
    },
  },

  backgroundColor: '#ffffff',
  textColor: '#000000',
};
