
export interface SearchbarChangeEventDetail {
  value: string | undefined;
}

export interface SearchbarEvent extends CustomEvent {
  target: HTMLIonSearchbarElement;
  detail: SearchbarChangeEventDetail;
}
