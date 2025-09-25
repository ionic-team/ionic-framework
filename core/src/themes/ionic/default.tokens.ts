import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';

export const defaultTheme: DefaultTheme = {
  palette: {
    light: lightTheme,
    dark: darkTheme,
  },
};
