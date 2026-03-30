import { generateColorSteps } from '../../utils/theme';
import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColorStep: generateColorSteps('#000000', '#ffffff'),
  textColorStep: generateColorSteps('#ffffff', '#888888'),
};
