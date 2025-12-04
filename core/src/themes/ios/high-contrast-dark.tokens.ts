import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  components: {
    IonItem: {
      /// Only the item borders should increase in contrast
      /// Borders for elements like toolbars should remain the same
      borderColor: 'var(--ion-color-gray-400)',
    },
    IonModal: {
      bg: 'var(--ion-color-gray-100)',
      toolbarBg: 'var(--ion-color-gray-150)',
      toolbarBorderColor: 'var(--ion-color-gray-250)',
    },
  }
};
