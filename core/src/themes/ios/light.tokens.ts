import { defaultPrimitiveColors } from '../base/default.tokens.primitives';
import type { LightTheme } from '../themes.interfaces';

const colors = {
  gray: defaultPrimitiveColors.gray,
};

export const lightTheme: LightTheme = {
  color: {
    gray: colors.gray,
  },
  components: {
    IonDatetime: {
      bg: colors.gray['950']!,
      timeBodyBg: '#edeef0',
    },
    IonBreadcrumb: {
      color: '#2d4665',
      bgFocused: 'rgba(233, 237, 243, 0.7)',
      iconColor: '#92a0b3',
      iconColorActive: '#242d39',
      iconColorFocused: '#445b78', // Available only in iOS
      indicatorBg: '#e9edf3',
      indicatorBgFocused: '#d9e0ea',
      separatorColor: '#73849a',
    },
  },
};
