export interface InputChangeEventDetail {
  value?: string | number | null;
  event?: Event;
}

// We recognize that InputInput is not an ideal naming pattern for this type.
// TODO (FW-2199): Explore renaming this type to something more appropriate.
export interface InputInputEventDetail {
  value?: string | number | null;
  event?: Event;
}

export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}
