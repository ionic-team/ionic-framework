export interface TextareaChangeEventDetail {
  value?: string | null;
  event?: Event;
}

export interface TextareaInputEventDetail {
  value?: string | null;
  event?: Event;
}

export interface TextareaCustomEvent<
  T = TextareaChangeEventDetail
> extends CustomEvent {
  detail: T;
  target: HTMLIonTextareaElement;
}
