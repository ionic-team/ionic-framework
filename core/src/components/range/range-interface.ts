export type KnobName = 'A' | 'B' | undefined;

export type RangeValue = number | {lower: number, upper: number};

export interface RangeChangeEventDetail {
  value: RangeValue;
}
