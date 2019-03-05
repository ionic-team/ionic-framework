export type SelectInterface = 'action-sheet' | 'popover' | 'alert';

export type SelectCompareFn = (currentValue: any, compareValue: any) => boolean;

export interface SelectChangeEventDetail {
  value: any | any[] | undefined | null;
}
