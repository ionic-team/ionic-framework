export type SegmentButtonLayout = 'icon-top' | 'icon-start' | 'icon-end' | 'icon-bottom' | 'icon-hide' | 'label-hide';

export interface SegmentChangeEventDetail {
  value?: string;
}

export interface SegmentCustomEvent extends CustomEvent {
  detail: SegmentChangeEventDetail;
  target: HTMLIonSegmentElement;
}
