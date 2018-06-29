import { GestureDetail } from '../../interface';

export interface ScrollBaseDetail {
  isScrolling: boolean;
}

export interface ScrollDetail extends GestureDetail, ScrollBaseDetail {
  positions: number[];
  scrollTop: number;
  scrollLeft: number;
}

export interface ScrollCallback {
  (detail?: ScrollDetail): boolean|void;
}
