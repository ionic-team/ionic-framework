export type SelectInterface = 'action-sheet' | 'popover' | 'alert';

export type SelectCompareFn = (currentValue: any, compareValue: any) => boolean;

export interface SelectChangeEventDetail<T = any> {
  value: T;
}

export interface SelectCustomEvent<T = any> extends CustomEvent {
  target: HTMLIonSelectElement;
  detail: SelectChangeEventDetail<T>;
}
