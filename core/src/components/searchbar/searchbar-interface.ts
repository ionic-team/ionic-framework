export interface SearchbarChangeEventDetail {
  value?: string;
}

/**
 * @deprecated
 * Use `IonSearchbarCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface SearchbarCustomEvent extends CustomEvent {
  detail: SearchbarChangeEventDetail;
  target: HTMLIonSearchbarElement;
}
