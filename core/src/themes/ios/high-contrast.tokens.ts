import { highContrastTheme as baseHighContrastTheme } from '../base/high-contrast.tokens';
import type { HighContrastTheme } from '../themes.interfaces';

export const highContrastTheme: HighContrastTheme = {
  ...baseHighContrastTheme,

  backgroundColor: '#ffffff',
  textColor: '#000000',
};
