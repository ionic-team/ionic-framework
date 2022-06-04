export interface TextareaChangeEventDetail {
  value?: string | null;
}

export interface TextareaCustomEvent extends CustomEvent {
  detail: TextareaChangeEventDetail;
  target: HTMLIonTextareaElement;
}
