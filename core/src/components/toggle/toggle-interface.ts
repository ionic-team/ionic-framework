
export interface ToggleChangeEventDetail<T = any> {
  value: T;
  checked: boolean;
}

export interface ToggleCustomEvent<T = any> extends CustomEvent {
  target: HTMLIonToggleElement;
  detail: ToggleChangeEventDetail<T>;
}
