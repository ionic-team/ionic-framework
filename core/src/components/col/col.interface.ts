import type { BreakpointMap, ScreenBreakpoint } from '@utils/breakpoints';

import type { IonPadding } from '../../themes/themes.interfaces';

export type IonColRecipe = {
  breakpoint?: {
    [K in ScreenBreakpoint]?: {
      padding?: IonPadding;
    };
  };
};

export type IonColBreakpointValues = BreakpointMap<string | number | null>;

export type IonColValue = string | number | IonColBreakpointValues;

export const ION_COL_PROPERTIES = ['size', 'order', 'offset'] as const;
export type IonColProperty = (typeof ION_COL_PROPERTIES)[number];

export type IonColStyle = {
  '--internal-col-margin'?: string;
  '--internal-col-span'?: string;
  order?: string;
};
