import type { GalleryColumns, GalleryGap } from './gallery-interface';

export const DEFAULT_COLUMNS = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 10,
} satisfies GalleryColumns;

export const DEFAULT_GAP = '16px' satisfies GalleryGap;
