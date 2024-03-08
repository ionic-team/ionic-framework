export type KnobName = 'A' | 'B' | undefined;

export type RangeValue = number | { lower: number; upper: number };

export type PinFormatter = (value: number) => number | string;

export interface RangeChangeEventDetail {
  value: RangeValue;
}

export interface RangeKnobMoveStartEventDetail {
  value: RangeValue;
}

export interface RangeKnobMoveEndEventDetail {
  value: RangeValue;
}

export interface RangeCustomEvent extends CustomEvent {
  detail: RangeChangeEventDetail | RangeKnobMoveStartEventDetail | RangeKnobMoveEndEventDetail;
  target: HTMLIonRangeElement;
}
