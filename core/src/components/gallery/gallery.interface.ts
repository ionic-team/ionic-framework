import type { BreakpointMap } from '@utils/breakpoints';

export type IonGalleryRecipe = {
  gap?: string;
};

export type IonGalleryBreakpointValues = BreakpointMap<string | number>;

export type IonGalleryColumns = string | number | IonGalleryBreakpointValues;
export type IonGalleryGap = string | number | IonGalleryBreakpointValues;
