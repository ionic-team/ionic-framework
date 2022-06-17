export interface ItemReorderEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | any[]) => any;
}

/**
 * @deprecated
 * Use `IonItemReorderGroupCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface ItemReorderCustomEvent extends CustomEvent {
  detail: ItemReorderEventDetail;
  target: HTMLIonReorderGroupElement;
}
