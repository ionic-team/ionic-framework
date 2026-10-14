import type { ScreenBreakpoint } from '@utils/breakpoints';

import type { IonPadding } from '../../themes/themes.interfaces';

export type IonGridRecipe = {
  breakpoint?: {
    [K in ScreenBreakpoint]?: {
      padding?: IonPadding;
      width?: string;
    };
  };

  columns?: number;
};
