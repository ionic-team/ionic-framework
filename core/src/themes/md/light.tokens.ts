import { defaultPrimitiveColors } from '../base/default.tokens.primitives';
import type { LightTheme } from '../themes.interfaces';

export const lightTheme: LightTheme = {
  components: {
    IonDatetime: {
      bg: defaultPrimitiveColors.white,
      timeBodyBg: '#edeef0',
    },
    IonBreadcrumb: {
      color: '#677483',
      bgFocused: defaultPrimitiveColors.white,
      iconColor: '#7d8894',
      iconColorActive: '#222d3a',
      indicatorBg: '#eef1f3',
      indicatorBgFocused: '#dfe5e8',
      colorFocused: '#35404e', // Available only in md
      separatorColor: '#73849a',
    },
    IonModal: {
      handleBg: '#c0c0be',
    },
  },
};
