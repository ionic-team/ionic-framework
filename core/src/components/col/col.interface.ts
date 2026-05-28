import type { IonPadding } from '../../themes/themes.interfaces';

export const ION_COL_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type IonColBreakpoint = (typeof ION_COL_BREAKPOINTS)[number];

export type IonColRecipe = {
  breakpoint?: {
    [K in IonColBreakpoint]?: {
      padding?: IonPadding;
    };
  };
};
