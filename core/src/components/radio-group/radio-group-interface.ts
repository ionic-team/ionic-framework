export interface RadioGroupChangeEventDetail<
  T = any
> {
  value: T;
  event?: Event;
}

export interface RadioGroupCustomEvent<
  T = any
> extends CustomEvent {
  detail: RadioGroupChangeEventDetail<T>;
  target: HTMLIonRadioGroupElement;
}

export type RadioGroupCompareFn = (
  currentValue: any,
  compareValue: any
) => boolean;
