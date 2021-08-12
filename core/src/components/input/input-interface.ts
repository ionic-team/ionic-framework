
export interface InputChangeEventDetail {
  value: string | undefined | null;
}

export interface InputEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}
