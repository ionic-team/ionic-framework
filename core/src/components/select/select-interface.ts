export type SelectInterface = 'action-sheet' | 'popover' | 'alert';

export type SelectCompareFn = (o1: any, o2: any) => boolean;

export interface SelectChangeEventDetail {
  value: any | any[] | undefined | null;
}
