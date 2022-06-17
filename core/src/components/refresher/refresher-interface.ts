export interface RefresherEventDetail {
  complete(): void;
}

/**
 * @deprecated
 * Use `IonRefresherCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface RefresherCustomEvent extends CustomEvent {
  detail: RefresherEventDetail;
  target: HTMLIonRefresherElement;
}
