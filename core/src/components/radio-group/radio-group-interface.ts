
export interface RadioGroupChangeEventDetail<T = any> {
  value: T;
}

export interface RadioGroupCustomEvent<T = any> extends CustomEvent {
  target: HTMLIonRadioGroupElement;
  detail: RadioGroupChangeEventDetail<T>;
}
