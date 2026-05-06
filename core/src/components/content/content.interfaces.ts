import type { GestureDetail } from '../../interface';
import type { IonPadding } from '../../themes/themes.interfaces';

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

export interface ScrollCustomEvent extends ScrollBaseCustomEvent {
  detail: ScrollDetail;
}

export interface IonContentRecipe {
  background?: string;
  color?: string;

  font?: {
    family?: string;
  };

  overflow?: string;
  padding?: IonPadding;
}
