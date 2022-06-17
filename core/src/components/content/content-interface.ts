import type { GestureDetail } from '../../interface';

export interface ScrollBaseDetail {
  isScrolling: boolean;
}

export interface ScrollDetail extends GestureDetail, ScrollBaseDetail {
  scrollTop: number;
  scrollLeft: number;
}

export type ScrollCallback = (detail?: ScrollDetail) => boolean | void;

export interface ScrollBaseCustomEvent extends CustomEvent {
  detail: ScrollBaseDetail;
  target: HTMLIonContentElement;
}

/**
 * @deprecated
 * Use `IonContentCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface ScrollCustomEvent extends ScrollBaseCustomEvent {
  detail: ScrollDetail;
}
