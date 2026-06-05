import type { IonPadding } from '../../themes/themes.interfaces';

export type IonGridRecipe = {
  breakpoint?: {
    [K in IonGridBreakpoint]?: {
      padding?: IonPadding;
      width?: string;
    };
  };

  columns?: number;
};

// TODO(FW-7285): Replace with global breakpoints
export const ION_GRID_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type IonGridBreakpoint = (typeof ION_GRID_BREAKPOINTS)[number];
