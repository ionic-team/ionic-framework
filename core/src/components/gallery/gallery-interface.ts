import type { BreakpointMap } from '@utils/breakpoints';

export type GalleryBreakpoints = BreakpointMap<string | number>;

export type GalleryColumns = string | number | GalleryBreakpoints;
export type GalleryGap = string | number | GalleryBreakpoints;
