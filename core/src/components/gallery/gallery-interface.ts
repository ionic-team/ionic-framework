export interface GalleryBreakpoints<T = string | number> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export type GalleryColumns = GalleryBreakpoints | string | number;
export type GalleryGap = GalleryBreakpoints | string | number;
