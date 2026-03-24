import { generateColorSteps } from '../../utils/theme';
import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColor: '#121212',

  // TODO(FW-6864): Remove once IonToolbar themes are added
  toolbar: {
    background: '#1f1f1f',
  },

  backgroundColorStep: generateColorSteps('#ffffff', '#121212'),
  textColorStep: generateColorSteps('#888888', '#ffffff'),
};
