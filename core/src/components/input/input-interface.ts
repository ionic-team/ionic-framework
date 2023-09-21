/**
 * Values are converted to strings when emitted which is
 * why we do not have a `number` type here even though the
 * `value` prop accepts a `number` type.
 */
export interface InputChangeEventDetail {
  value?: string | null;
  event?: Event;
}

// We recognize that InputInput is not an ideal naming pattern for this type.
// TODO (FW-2199): Explore renaming this type to something more appropriate.
export interface InputInputEventDetail {
  value?: string | null;
  event?: Event;
}

export interface InputCustomEvent<T = InputChangeEventDetail> extends CustomEvent {
  detail: T;
  target: HTMLIonInputElement;
}

export type InputValue = string | number | null | undefined;
