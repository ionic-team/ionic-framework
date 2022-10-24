export interface ToggleChangeEventDetail<T = any> {
  value: T;
  checked: boolean;
}

export interface ToggleCustomEvent<T = any> extends CustomEvent {
  detail: ToggleChangeEventDetail<T>;
  target: HTMLIonToggleElement;
}
