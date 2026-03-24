import { generateColorSteps } from '../../utils/theme';
import { highContrastDarkTheme as baseHighContrastDarkTheme } from '../base/high-contrast-dark.tokens';
import type { HighContrastDarkTheme } from '../themes.interfaces';

export const highContrastDarkTheme: HighContrastDarkTheme = {
  ...baseHighContrastDarkTheme,

  backgroundColorStep: generateColorSteps('#ffffff', '#000000'),
  textColorStep: generateColorSteps('#888888', '#ffffff'),
};
