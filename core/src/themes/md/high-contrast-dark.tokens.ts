import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColor: '#121212',
  textColor: '#000000',

  // TODO(FW-6864): Remove once IonToolbar themes are added
  toolbar: {
    background: '#1f1f1f',
  },

  components: {
    IonItem: {
      /// Only the item borders should increase in contrast
      /// Borders for elements like toolbars should remain the same
      borderColor: 'var(--ion-color-gray-400)',
    },
  },
};
