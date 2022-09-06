export interface InputChangeEventDetail {
  value: string | undefined | null;
}

// We recognize that InputInput is not an ideal naming pattern for this type.
// TODO: Explore renaming this type to something more appropriate.
export type InputInputEventDetail = InputEvent | Event;

export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}
