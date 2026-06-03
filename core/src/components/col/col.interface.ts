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

/**
 * The column layout properties that accept responsive, breakpoint-suffixed
 * values (e.g. `size`, `sizeMd`, `offsetLg`).
 */
export type IonColProperty = 'size' | 'order' | 'offset';

/**
 * The inline custom properties col writes to drive the token-based calc() in
 * col.scss. All keys are optional — only the ones matching the column's set
 * attributes are present. Declared as a type alias (not an interface) so it
 * keeps an implicit index signature and assigns to the host `style` prop.
 */
export type IonColStyle = {
  '--internal-col-margin'?: string;
  '--internal-col-span'?: string;
  order?: string;
};
