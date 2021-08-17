
export interface TextareaChangeEventDetail {
  value: string | undefined | null;
}

export interface TextareaCustomEvent extends CustomEvent {
  target: HTMLIonTextareaElement;
  detail: TextareaChangeEventDetail;
}
