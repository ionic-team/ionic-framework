export interface TextareaChangeEventDetail {
  value?: string | null;
  event?: Event;
}

export interface TextareaInputEventDetail {
  value?: string | null;
  event?: Event;
}

export interface TextareaCustomEvent extends CustomEvent {
  detail: TextareaChangeEventDetail;
  target: HTMLIonTextareaElement;
}
