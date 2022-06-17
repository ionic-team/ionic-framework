export interface InputChangeEventDetail {
  value: string | undefined | null;
}

/**
 * @deprecated
 * Use `IonInputCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}
