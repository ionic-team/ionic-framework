/**
 * Values are converted to strings when emitted which is
 * why we do not have a `number` type here even though the
 * `value` prop accepts a `number` type.
 */
export interface InputOtpInputEventDetail {
  value?: string | null;
  event?: Event;
}
export interface InputOtpChangeEventDetail {
  value?: string | null;
  event?: Event;
}

export interface InputOtpCompleteEventDetail {
  value?: string | null;
  event?: Event;
}

export interface InputOtpCustomEvent<T = InputOtpChangeEventDetail> extends CustomEvent {
  detail: T;
  target: HTMLIonInputOtpElement;
}
