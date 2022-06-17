export type SelectInterface = 'action-sheet' | 'popover' | 'alert';

export type SelectCompareFn = (currentValue: any, compareValue: any) => boolean;

export interface SelectChangeEventDetail<T = any> {
  value: T;
}

/**
 * @deprecated
 * Use `IonSelectCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface SelectCustomEvent<T = any> extends CustomEvent {
  detail: SelectChangeEventDetail<T>;
  target: HTMLIonSelectElement;
}
