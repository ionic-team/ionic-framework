import { defaultTheme as baseDefaultTheme } from '../base/default.tokens';
import type { DefaultTheme } from '../themes.interfaces';

import { darkTheme } from './dark.tokens';
import { lightTheme } from './light.tokens';

export const defaultTheme: DefaultTheme = {
  ...baseDefaultTheme,

  name: 'md',

  palette: {
    light: lightTheme,
    dark: darkTheme,
  },

  fontFamily: '"Roboto", "Helvetica Neue", sans-serif',
};
