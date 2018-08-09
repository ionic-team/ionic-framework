import { GestureDetail } from '../../interface';

export interface ScrollBaseDetail {
  isScrolling: boolean;
}

export interface ScrollDetail extends GestureDetail, ScrollBaseDetail {
  scrollTop: number;
  scrollLeft: number;
}

export type ScrollCallback = (detail?: ScrollDetail) => boolean | void;
