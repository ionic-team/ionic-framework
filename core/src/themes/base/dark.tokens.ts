export const defaultDarkTheme = {
  enabled: 'never', // 'always' | 'system' | 'class' | 'never'
  color: {
    primary: {
      bold: {
        base: '#0054e9',
        constrast: '#ffffff',
        shade: '#0041c4', // darker version
        tint: '#0065ff', // lighter version
      },
      subtle: {
        base: '#0054e9',
        constrast: '#ffffff',
        shade: '#0041c4', // darker version
        tint: '#0065ff', // lighter version
      },
    },
    secondary: {
      bold: {
        base: '#0163aa',
        constrast: '#ffffff',
        shade: '#015a9e',
        tint: '#0176c4',
      },
      subtle: {
        base: '#0163aa',
        constrast: '#ffffff',
        shade: '#015a9e',
        tint: '#0176c4',
      },
    },
    red: {
      50: '#ffebee',
      100: '#ffcdd2',
      200: '#ef9a9a',
    },
    blue: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
    },
    gray: {
      50: '#f5f5f5',
      100: '#eeeeee',
      200: '#e0e0e0',
      300: '#bdbdbd',
      400: '#9e9e9e',
      500: '#757575',
      600: '#616161',
      700: '#424242',
      800: '#212121',
    },
    white: 'green',
    black: '#000000',
  },
};

export type Theme = typeof defaultDarkTheme;
