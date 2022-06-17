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

/**
 * @deprecated
 * Use `IonRangeCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface RangeCustomEvent extends CustomEvent {
  detail: RangeChangeEventDetail | RangeKnobMoveStartEventDetail | RangeKnobMoveEndEventDetail;
  target: HTMLIonRangeElement;
}
