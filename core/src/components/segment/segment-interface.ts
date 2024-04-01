export type SegmentButtonLayout =
  | 'icon-top'
  | 'icon-start'
  | 'icon-end'
  | 'icon-bottom'
  | 'icon-hide'
  | 'label-hide';

export type SegmentValue =
  | string
  | number;

export interface SegmentChangeEventDetail {
  value?: SegmentValue;
}

export interface SegmentCustomEvent
  extends CustomEvent {
  detail: SegmentChangeEventDetail;
  target: HTMLIonSegmentElement;
}
