export type RangeKnobName = 'A' | 'B';

export type RangeKnobPosition = 'lower' | 'upper';

export type RangeValue = number | { lower: number; upper: number };

export type PinFormatter = (value: number) => number | string;

export interface RangeChangeEventDetail {
  value: RangeValue;
}

export interface RangeKnobMoveStartEventDetail {
  value: RangeValue;
  /**
   * The knob being moved. Each knob keeps its name even if the knobs
   * cross. A single knob range always reports `A`.
   */
  knob: RangeKnobName;
  /**
   * Whether the moved knob holds the `lower` or `upper` value before it moves.
   * A single knob range always reports `lower`.
   */
  position: RangeKnobPosition;
}

export interface RangeKnobMoveEndEventDetail {
  value: RangeValue;
  /**
   * The knob that was moved. Each knob keeps its name even if the knobs
   * cross. A single knob range always reports `A`.
   */
  knob: RangeKnobName;
  /**
   * Whether the moved knob holds the `lower` or `upper` value after it moves.
   * A single knob range always reports `lower`.
   */
  position: RangeKnobPosition;
}

export interface RangeCustomEvent extends CustomEvent {
  detail: RangeChangeEventDetail | RangeKnobMoveStartEventDetail | RangeKnobMoveEndEventDetail;
  target: HTMLIonRangeElement;
}

export interface RangeKnobMoveStartCustomEvent extends CustomEvent {
  detail: RangeKnobMoveStartEventDetail;
  target: HTMLIonRangeElement;
}

export interface RangeKnobMoveEndCustomEvent extends CustomEvent {
  detail: RangeKnobMoveEndEventDetail;
  target: HTMLIonRangeElement;
}
