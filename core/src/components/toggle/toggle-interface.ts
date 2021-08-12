
export interface ToggleChangeEventDetail<T = any> {
  value: T;
  checked: boolean;
}

export interface ToggleEvent<T = any> extends CustomEvent {
  target: HTMLIonToggleElement;
  detail: ToggleChangeEventDetail<T>;
}
