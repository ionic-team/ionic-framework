export interface CheckboxChangeEventDetail<T = any> {
  value: T;
  checked: boolean;
}

/**
 * @deprecated
 * Use `IonCheckboxCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface CheckboxCustomEvent<T = any> extends CustomEvent {
  detail: CheckboxChangeEventDetail<T>;
  target: HTMLIonCheckboxElement;
}
