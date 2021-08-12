
export interface CheckboxChangeEventDetail<T = any> {
  value: T;
  checked: boolean;
}

export interface CheckboxEvent<T = any> extends CustomEvent {
  detail: CheckboxChangeEventDetail<T>;
  target: HTMLIonCheckboxElement;
}
