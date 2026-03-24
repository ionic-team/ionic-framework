import { generateColorSteps } from '../../utils/theme';
import { darkTheme as baseDarkTheme } from '../base/dark.tokens';
import type { DarkTheme } from '../themes.interfaces';

export const darkTheme: DarkTheme = {
  ...baseDarkTheme,

  backgroundColor: '#121212',
  backgroundColorRgb: '18, 18, 18',

  // TODO(FW-6864): Remove once IonToolbar themes are added
  toolbar: {
    background: '#1f1f1f',
  },

  backgroundColorStep: generateColorSteps('#121212', '#ffffff'),
  textColorStep: generateColorSteps('#ffffff', '#121212'),

  components: {
    IonCard: {
      background: '#1e1e1e',
    },
    IonItem: {
      background: '#1e1e1e',
    },
    IonToolbar: {
      background: '#1f1f1f',
    },
    IonTabBar: {
      background: '#1f1f1f',
    },
  },
};
