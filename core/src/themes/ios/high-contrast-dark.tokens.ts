import { generateColorSteps } from '../../utils/theme';
import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColor: '#000000',
  textColor: '#ffffff',

  color: {
    gray: generateColorSteps('#ffffff', '#000000', true),
    text: generateColorSteps('#ffffff', '#888888'),
  },
};
