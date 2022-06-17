export type SegmentButtonLayout = 'icon-top' | 'icon-start' | 'icon-end' | 'icon-bottom' | 'icon-hide' | 'label-hide';

export interface SegmentChangeEventDetail {
  value?: string;
}

/**
 * @deprecated
 * Use `IonSegmentCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface SegmentCustomEvent extends CustomEvent {
  detail: SegmentChangeEventDetail;
  target: HTMLIonSegmentElement;
}
