export interface ToggleChangeEventDetail<T = any> {
  value: T;
  checked: boolean;
}

/**
 * @deprecated
 * Use `IonToggleCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface ToggleCustomEvent<T = any> extends CustomEvent {
  detail: ToggleChangeEventDetail<T>;
  target: HTMLIonToggleElement;
}
