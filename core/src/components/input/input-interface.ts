export interface InputChangeEventDetail {
  value: string | undefined | null;
}

export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}
