import type { IonPadding } from '../../themes/themes.interfaces';
import { ION_GRID_BREAKPOINTS } from '../grid/grid.interface';

export type IonColRecipe = {
  breakpoint?: {
    [K in IonColBreakpoint]?: {
      padding?: IonPadding;
    };
  };
};

// TODO(FW-7285): Replace with global breakpoints
export const ION_COL_BREAKPOINTS = ION_GRID_BREAKPOINTS;
export type IonColBreakpoint = (typeof ION_COL_BREAKPOINTS)[number];

export type IonColProperty = 'size' | 'order' | 'offset';

export type IonColStyle = {
  '--internal-col-margin'?: string;
  '--internal-col-span'?: string;
  order?: string;
};
