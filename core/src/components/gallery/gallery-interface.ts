export interface GalleryBreakpointColumns {
  xs?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
  xxl?: string | number;
}

export type GalleryColumns = GalleryBreakpointColumns | string | number;
