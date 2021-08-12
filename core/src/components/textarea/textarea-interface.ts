
export interface TextareaChangeEventDetail {
  value: string | undefined | null;
}

export interface TextareaEvent extends CustomEvent {
  target: HTMLIonTextareaElement;
  detail: TextareaChangeEventDetail;
}
