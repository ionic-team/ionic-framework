export interface RadioGroupChangeEventDetail<T = any> {
  value: T;
}

/**
 * @deprecated
 * Use `IonRadioGroupCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface RadioGroupCustomEvent<T = any> extends CustomEvent {
  detail: RadioGroupChangeEventDetail<T>;
  target: HTMLIonRadioGroupElement;
}
