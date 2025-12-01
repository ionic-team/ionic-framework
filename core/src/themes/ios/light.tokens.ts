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
    IonItem: {
      paragraphTextColor: '#a3a3a3',
    },
    IonModal: {
      handleBg: '#c0c0be',
    },
    IonPicker: {
      highlightBg: '#eeeeef', // Available only in iOS
    },
    IonRange: {
      bg: colors.gray['100']!, // Available only in iOS
    },
    IonRefresher: {
      nativeSpinnerColor: '#747577', // Available only in iOS
    },
  },
};
