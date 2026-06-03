import type { IonPadding } from '../../themes/themes.interfaces';
import { ION_GRID_BREAKPOINTS } from '../grid/grid.interface';

export type IonColRecipe = {
  breakpoint?: {
    [K in IonColBreakpoint]?: {
      padding?: IonPadding;
    };
  };
};

// TODO(FW-7285): Replace with global breakpoints when they are available
export const ION_COL_BREAKPOINTS = ION_GRID_BREAKPOINTS;
export type IonColBreakpoint = (typeof ION_COL_BREAKPOINTS)[number];
