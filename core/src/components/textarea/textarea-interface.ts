export interface TextareaChangeEventDetail {
  value?: string | null;
}

/**
 * @deprecated
 * Use `IonTextareaCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface TextareaCustomEvent extends CustomEvent {
  detail: TextareaChangeEventDetail;
  target: HTMLIonTextareaElement;
}
