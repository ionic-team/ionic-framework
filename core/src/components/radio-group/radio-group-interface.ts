
export interface RadioGroupChangeEventDetail<T = any> {
  value: T;
}

export interface RadioGroupEvent<T = any> extends CustomEvent {
  target: HTMLIonRadioGroupElement;
  detail: RadioGroupChangeEventDetail<T>;
}
